using KoalaWiki.Entities;

namespace KoalaWiki.KoalaWarehouse;

public class DocumentsService
{
    public async Task HandleAsync(Document document,Warehouse warehouse)
    {
        // 解析仓库的目录结构
        var path = document.GitPath;

        var pathInfos = new List<PathInfo>();
        // 递归扫描目录所有文件和目录
        ScanDirectory(path, pathInfos);
        
        var kernel = KernelFactory.GetKernel(warehouse.OpenAIEndpoint,
            warehouse.OpenAIKey,
            warehouse.Model);
        
        
    }

    // 递归方法，用于遍历目录
    void ScanDirectory(string directoryPath, List<PathInfo> infoList)
    {
        // 遍历所有文件
        infoList.AddRange(from file in Directory.GetFiles(directoryPath) let fileInfo = new FileInfo(file) select new PathInfo { Path = file, Name = fileInfo.Name, Type = "File" });

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

public class PathInfo
{
    public string Path { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }
}