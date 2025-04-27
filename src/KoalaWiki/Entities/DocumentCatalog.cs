namespace KoalaWiki.Entities;

public class DocumentCatalog : Entity<string>
{
    /// <summary>
    /// 目录名称
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 目录描述
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// 目录父级Id
    /// </summary>
    /// <returns></returns>
    public string? ParentId { get; set; } = string.Empty;
    
    /// <summary>
    /// 文档id
    /// </summary>
    public string DucumentId { get; set; } = string.Empty;
    
    public string WarehouseId { get; set; } = string.Empty;
}