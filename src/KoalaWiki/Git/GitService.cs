using System.ComponentModel;
using LibGit2Sharp;

namespace KoalaWiki.Git;

public class GitService
{
    private string GetRepositoryPath(string repositoryUrl)
    {
        // 解析仓库地址
        var uri = new Uri(repositoryUrl);
        // 得到组织名和仓库名称
        var segments = uri.Segments;
        var organization = segments[1].Trim('/');
        var repositoryName = segments[2].Trim('/');

        // 拼接本地路径
        var repositoryPath = Path.Combine("repositories", organization, repositoryName);
        return repositoryPath;
    }

    /// <summary>
    /// 拉取指定仓库
    /// </summary>
    /// <returns></returns>
    public async Task<string> PullRepository(
        [Description("仓库地址")] string repositoryUrl,
        [Description("分支")] string branch = "master")
    {
        var localPath = GetRepositoryPath(repositoryUrl);

        // 配置克隆选项
        var cloneOptions = new CloneOptions
        {
            FetchOptions =
            {
                Depth = 1 // 浅克隆，仅获取最新提交
            }
        };
        // cloneOptions.FetchOptions.CredentialsProvider = (_url, _user, _cred) =>
        //     new UsernamePasswordCredentials { Username = "your-username", Password = "your-password" }; // 如果需要认证
        // 执行克隆操作
        var str = Repository.Clone(repositoryUrl, localPath, cloneOptions);

        return localPath;
    }
}