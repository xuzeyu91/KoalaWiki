using System.Text.Json;
using KoalaWiki.Entities;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace KoalaWiki.KoalaWarehouse;

public class DocumentsService
{
    public async Task HandleAsync(Document document, Warehouse warehouse)
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
            ResponseFormat = typeof(List<DocumentResultCatalogue>)
        };

        var catalogue = JsonSerializer.Serialize(pathInfos, new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            // 中文乱码
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        });

        var result = await kernel.InvokeAsync(plugin, new KernelArguments(settings)
        {
            ["catalogue"] = catalogue,
            ["readme"] = await ReadMeFile(path)
        });
        
        
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

    // 递归方法，用于遍历目录
    void ScanDirectory(string directoryPath, List<PathInfo> infoList)
    {
        // 遍历所有文件
        infoList.AddRange(from file in Directory.GetFiles(directoryPath)
            let fileInfo = new FileInfo(file)
            select new PathInfo { Path = file, Name = fileInfo.Name, Type = "File" });

        // 遍历所有目录，并递归扫描
        foreach (var directory in Directory.GetDirectories(directoryPath))
        {
            var dirInfo = new DirectoryInfo(directory);
            infoList.Add(new PathInfo
            {
                Path = directory,
                Name = dirInfo.Name,
                Type = "Directory"
            });

            // 递归扫描子目录
            ScanDirectory(directory, infoList);
        }
    }
}

public class DocumentResultCatalogue
{
    public string description { get; set; }

    public string name { get; set; }

    public List<DocumentResultCatalogue> children { get; set; }
}

public class PathInfo
{
    public string Path { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }
}