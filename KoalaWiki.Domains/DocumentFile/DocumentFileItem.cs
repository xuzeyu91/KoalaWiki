﻿using System.ComponentModel.DataAnnotations.Schema;

namespace KoalaWiki.Entities.DocumentFile;

/// <inheritdoc />
public class DocumentFileItem : Entity<string>
{
    /// <summary>
    /// 标题
    /// </summary>
    public string Title { get; set; }
    
    /// <summary>
    /// 描述
    /// </summary>
    public string Description { get; set; }
    
    /// <summary>
    /// 文档实际内容
    /// </summary>
    public string Content { get; set; }
    
    /// <summary>
    /// 评论数量
    /// </summary>
    public long CommentCount { get; set; }
    
    /// <summary>
    /// 文档大小
    /// </summary>
    public long Size { get; set; }
    
    /// <summary>
    /// 绑定的目录ID
    /// </summary>
    public string DocumentCatalogId { get; set; }
    
    /// <summary>
    /// 请求token消耗
    /// </summary>
    /// <returns></returns>
    public int RequestToken { get; set; }
    
    /// <summary>
    /// 响应token
    /// </summary>
    public int ResponseToken { get; set; }
    
    /// <summary>
    /// 相关源文件
    /// </summary>
    /// <returns></returns>
    [NotMapped]
    public List<DocumentFileItemSource>? Source { get; set; } 
    
    /// <summary>
    /// 源数据
    /// </summary>
    public Dictionary<string,string> Metadata { get; set; } = new();
    
    /// <summary>
    /// 扩展数据
    /// </summary>
    public Dictionary<string,string> Extra { get; set; } = new();
}