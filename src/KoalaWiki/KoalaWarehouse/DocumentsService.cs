using System.Text;
using System.Text.Json;
using KoalaWiki.DbAccess;
using KoalaWiki.Entities;
using Microsoft.SemanticKernel;
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
            catalogue.Append($"文件名：{info.Name}，路径：{info.Path}，类型：{info.Type}\n");
        }

        var str = new StringBuilder();

        await foreach (var item in kernel.InvokeStreamingAsync(plugin, new KernelArguments(settings)
                       {
                           ["catalogue"] = catalogue,
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

        var documentGeneration = kernel.Plugins["CodeAnalysis"]["DocumentGeneration"];
        settings = new()
        {
            FunctionChoiceBehavior = FunctionChoiceBehavior.Auto(),
        };
        
        kernel = KernelFactory.GetKernel(warehouse.OpenAIEndpoint,
            warehouse.OpenAIKey,
            "o4-mini");
        
        // 开始根据目录结构创建文档
        foreach (var item in documents)
        {
            var sr = new StringBuilder();

            await foreach (var sk in kernel.InvokeStreamingAsync(documentGeneration, new KernelArguments(settings)
                           {
                               ["catalogue"] =catalogue,
                               ["readme"] = await ReadMeFile(path),
                               ["title"] = item.Name
                           }))
            {
                sr.Append(sk);
            }
        }

        // 将解析的目录结构保存到数据库
        await dbContext.DocumentCatalogs.AddRangeAsync(documents);

        await dbContext.SaveChangesAsync();
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