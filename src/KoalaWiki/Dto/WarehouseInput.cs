namespace KoalaWiki.Dto;

public class WarehouseInput
{
    /// <summary>
    /// 仓库地址
    /// </summary>
    /// <returns></returns>
    public string Address { get; set; }

    /// <summary>
    /// 仓库类型
    /// </summary>
    public string Type { get; set; }

    /// <summary>
    /// 仓库分支
    /// </summary>
    public string Branch { get; set; }

    /// <summary>
    /// 构建提示词
    /// </summary>
    public string Prompt { get; set; }

    /// <summary>
    /// 使用模型
    /// </summary>
    public string Model { get; set; } = string.Empty;

    /// <summary>
    /// OpenAI 密钥
    /// </summary>
    public string OpenAIKey { get; set; } = string.Empty;

    /// <summary>
    /// OpenAI 端点
    /// </summary>
    public string OpenAIEndpoint { get; set; } = string.Empty;
}