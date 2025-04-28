using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using KoalaWiki.DbAccess;
using KoalaWiki.Entities;
using KoalaWiki.Entities.DocumentFile;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace KoalaWiki.KoalaWarehouse;

public class DocumentsService
{
    public async Task HandleAsync(Document document, Warehouse warehouse, KoalaDbAccess dbContext)
    {
        // 解析仓库的目录结构
        var path = document.GitPath;

        var pathInfos = new List<PathInfo>();
        // 递归扫描目录所有文件和目录
        ScanDirectory(path, pathInfos);

        var kernel = KernelFactory.GetKernel(warehouse.OpenAIEndpoint,
            warehouse.OpenAIKey,
            warehouse.Model);


        var plugin = kernel.Plugins["CodeAnalysis"]["AnalyzeCatalogue"];

        OpenAIPromptExecutionSettings settings = new()
        {
            FunctionChoiceBehavior = FunctionChoiceBehavior.Auto(),
            ResponseFormat = typeof(DocumentResultCatalogue),
            Temperature = 0.5,
        };

        var catalogue = new StringBuilder();

        foreach (var info in pathInfos)
        {
            catalogue.Append($"文件绝对路径：{info.Path}\n");
        }


        var overview = await GenerateProjectOverview(KernelFactory.GetKernel(warehouse.OpenAIEndpoint,
            warehouse.OpenAIKey, warehouse.Model, false), catalogue.ToString(), path);

        await dbContext.DocumentOverviews.Where(x => x.DocumentId == document.Id)
            .ExecuteDeleteAsync();

        await dbContext.DocumentOverviews.AddAsync(new DocumentOverview()
        {
            Content = overview,
            Title = "",
            DocumentId = document.Id,
            Id = Guid.NewGuid().ToString("N")
        });


        var str = new StringBuilder();

        await foreach (var item in kernel.InvokeStreamingAsync(plugin, new KernelArguments(settings)
                       {
                           ["catalogue"] = catalogue.ToString(),
                           ["readme"] = await ReadMeFile(path)
                       }))
        {
            str.Append(item);
        }

        var result = JsonSerializer.Deserialize<DocumentResultCatalogue>(str.ToString());

        var documents = new List<DocumentCatalog>();
        // 递归处理目录层次结构
        ProcessCatalogueItems(result.Items, null, warehouse, document, documents);

        documents.ForEach(x => x.Id = Guid.NewGuid().ToString("N"));

        var documentFileItems = new List<DocumentFileItem>();

        // 开始根据目录结构创建文档
        foreach (var item in documents)
        {
            var file = await ProcessCatalogueItems(item, kernel, catalogue.ToString(), await ReadMeFile(path));

            documentFileItems.Add(file);
        }

        // 将解析的目录结构保存到数据库
        await dbContext.DocumentCatalogs.AddRangeAsync(documents);


        await dbContext.DocumentFileItems.AddRangeAsync(documentFileItems);

        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// 生成项目概述
    /// </summary>
    /// <returns></returns>
    private async Task<string> GenerateProjectOverview(Kernel kernel, string catalog,
        string readmePath)
    {
        var sr = new StringBuilder();

        var settings = new OpenAIPromptExecutionSettings()
        {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
        };

        var chat = kernel.GetRequiredService<IChatCompletionService>();
        var history = new ChatHistory();

        history.AddUserMessage(Prompt.Overview.Replace("{{$catalogue}}", catalog)
            .Replace("{{$readme}}", await ReadMeFile(readmePath)));

        await foreach (var item in chat.GetStreamingChatMessageContentsAsync(history, settings, kernel))
        {
            if (!string.IsNullOrEmpty(item.Content))
            {
                sr.Append(item.Content);
            }
        }

        // 使用正则表达式将<blog></blog>中的内容提取
        var regex = new Regex(@"<blog>(.*?)</blog>", RegexOptions.Singleline);

        var match = regex.Match(sr.ToString());

        if (match.Success)
        {
            // 提取到的内容
            var extractedContent = match.Groups[1].Value;
            sr.Clear();
            sr.Append(extractedContent);
        }

        return sr.ToString();
    }

    /// <summary>
    /// 处理每一个标题产生文件内容
    /// </summary>
    private async Task<DocumentFileItem> ProcessCatalogueItems(DocumentCatalog catalog, Kernel kernel, string catalogue,
        string readmePath)
    {
        var chat = kernel.Services.GetService<IChatCompletionService>();

        var history = new ChatHistory();

        history.AddUserMessage(Prompt.DefaultPrompt.Replace("{{$catalogue}}", catalogue)
            .Replace("{{$readme}}", await ReadMeFile(readmePath))
            .Replace("{{$title}}", catalog.Name));


        var sr = new StringBuilder();

        await foreach (var i in chat.GetStreamingChatMessageContentsAsync(history, new OpenAIPromptExecutionSettings()
                       {
                           ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
                       }, kernel))
        {
            if (!string.IsNullOrEmpty(i.Content))
            {
                sr.Append(i.Content);
            }
        }

        // 使用正则表达式将<blog></blog>中的内容提取
        var regex = new Regex(@"<blog>(.*?)</blog>", RegexOptions.Singleline);

        var match = regex.Match(sr.ToString());

        if (match.Success)
        {
            // 提取到的内容
            var extractedContent = match.Groups[1].Value;
            sr.Clear();
            sr.Append(extractedContent);
        }

        var fileItem = new DocumentFileItem()
        {
            Content = sr.ToString(),
            DocumentCatalogId = catalog.Id,
            Description = string.Empty,
            Extra = new Dictionary<string, string>(),
            Metadata = new Dictionary<string, string>(),
            Source = new List<DocumentFileItemSource>(),
            CommentCount = 0,
            RequestToken = 0,
            CreatedAt = DateTime.Now,
            Id = Guid.NewGuid().ToString("N"),
            ResponseToken = 0,
            Size = 0,
            Title = catalog.Name,
        };

        return fileItem;
    }

    private void ProcessCatalogueItems(List<DocumentResultCatalogueItem> items, string? parentId, Warehouse warehouse,
        Document document, List<DocumentCatalog>? documents)
    {
        int order = 0; // 创建排序计数器
        foreach (var item in items)
        {
            var documentItem = new DocumentCatalog
            {
                WarehouseId = warehouse.Id,
                Description = item.title,
                Id = Guid.NewGuid().ToString("N"),
                Name = item.name,
                Url = item.title,
                DucumentId = document.Id,
                ParentId = parentId,
                Order = order++ // 为当前层级的每个项目设置顺序值并递增
            };

            documents.Add(documentItem);

            ProcessCatalogueItems(item.children.SelectMany(x => x.Items).ToList(), documentItem.Id, warehouse, document,
                documents);
        }
    }

    /// <summary>
    /// 读取仓库的ReadMe文件
    /// </summary>
    /// <returns></returns>
    private async Task<string> ReadMeFile(string path)
    {
        var readmePath = Path.Combine(path, "README.md");
        if (File.Exists(readmePath))
        {
            return await File.ReadAllTextAsync(readmePath);
        }

        readmePath = Path.Combine(path, "README.txt");
        if (File.Exists(readmePath))
        {
            return await File.ReadAllTextAsync(readmePath);
        }

        readmePath = Path.Combine(path, "README");
        if (File.Exists(readmePath))
        {
            return await File.ReadAllTextAsync(readmePath);
        }

        return "仓库没有README文件";
    }

    private static readonly string[] IngoreFiles =
        { ".git", ".idea", ".vscode", "node_modules", ".DS_Store", ".gitignore" };

    // 递归方法，用于遍历目录
    void ScanDirectory(string directoryPath, List<PathInfo> infoList)
    {
        // 遍历所有文件
        infoList.AddRange(from file in Directory.GetFiles(directoryPath).Where(x => !x.StartsWith("."))
            let fileInfo = new FileInfo(file)
            select new PathInfo { Path = file, Name = fileInfo.Name, Type = "File" });

        // 遍历所有目录，并递归扫描
        foreach (var directory in Directory.GetDirectories(directoryPath))
        {
            // 忽略.开头的目录
            if (directory.StartsWith("."))
            {
                continue;
            }

            // 忽略指定的目录
            if (IngoreFiles.Any(x => directory.Contains(x)))
            {
                continue;
            }

            // 递归扫描子目录
            ScanDirectory(directory, infoList);
        }
    }
}

public class DocumentResultCatalogue
{
    public List<DocumentResultCatalogueItem> Items { get; set; } = new List<DocumentResultCatalogueItem>();
}

public class DocumentResultCatalogueItem
{
    public string name { get; set; }

    public string title { get; set; }

    public List<DocumentResultCatalogue> children { get; set; }
}

public class PathInfo
{
    public string Path { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }
}