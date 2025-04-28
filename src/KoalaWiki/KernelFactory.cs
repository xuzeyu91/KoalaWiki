using System.ClientModel;
using System.Collections.Concurrent;
using KoalaWiki.Functions;
using Microsoft.SemanticKernel;
using OpenAI;
using Serilog;

#pragma warning disable SKEXP0010

namespace KoalaWiki;

public class KernelFactory
{
    public static Kernel GetKernel(string chatEndpoint,
        string chatApiKey,
        string model = "gpt-4.1", bool isCodeAnalysis = true)
    {
        var kernelBuilder = Kernel.CreateBuilder();

        kernelBuilder.Services.AddSerilog(Log.Logger);

        kernelBuilder.AddOpenAIChatCompletion(model, new Uri(chatEndpoint), chatApiKey, "Koala-Wiki",
            httpClient: new HttpClient(new HttpClientHandler()
            {
                //添加重试试
                AllowAutoRedirect = true,
                MaxAutomaticRedirections = 5,
                MaxConnectionsPerServer = 100,
            })
            {
                // 添加重试
                Timeout = TimeSpan.FromSeconds(120),
            });

        if (isCodeAnalysis)
        {
            kernelBuilder.Plugins.AddFromPromptDirectory(Path.Combine(AppContext.BaseDirectory, "plugins",
                "CodeAnalysis"));
        }

        kernelBuilder.Plugins.AddFromType<FileFunction>("FileFunctions");

        var kernel = kernelBuilder.Build();

        return kernel;
    }
}