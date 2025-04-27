using System.ClientModel;
using System.Collections.Concurrent;
using KoalaWiki.Functions;
using Microsoft.SemanticKernel;
using OpenAI;

#pragma warning disable SKEXP0010

namespace KoalaWiki;

public class KernelFactory
{
    private static ConcurrentDictionary<string, Kernel> _kernels = new();

    public static Kernel GetKernel(string chatEndpoint,
        string chatApiKey,
        string model = "gpt-4.1")
    {
        return _kernels.GetOrAdd(chatApiKey + chatEndpoint + model, (s =>
        {
            var kernelBuilder = Kernel.CreateBuilder();

            kernelBuilder.AddOpenAIChatCompletion(model, new Uri(chatEndpoint), chatApiKey);

            kernelBuilder.Plugins.AddFromPromptDirectory(Path.Combine(AppContext.BaseDirectory, "plugins",
                "CodeAnalysis"));

            kernelBuilder.Plugins.AddFromType<FileFunction>("FileFunctions");

            var kernel = kernelBuilder.Build();

            return kernel;
        }));
    }
}