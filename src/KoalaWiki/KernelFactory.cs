using System.ClientModel;
using System.Collections.Concurrent;
using Microsoft.SemanticKernel;
using OpenAI;

#pragma warning disable SKEXP0010

namespace KoalaWiki;

public class KernelFactory
{
    private static ConcurrentDictionary<string, Kernel> _kernels = new();

    public static Kernel GetKernel(string embeddingEndpoint,
        string embeddingApiKey,
        string model = "gpt-4.1")
    {
        return _kernels.GetOrAdd(embeddingApiKey + embeddingEndpoint + model, (s =>
        {
            var kernelBuilder = Kernel.CreateBuilder();

            kernelBuilder.AddOpenAITextEmbeddingGeneration(model, new OpenAIClient(
                new ApiKeyCredential(embeddingApiKey),
                new OpenAIClientOptions()
                {
                    Endpoint = new Uri(embeddingEndpoint)
                }));

            kernelBuilder.Plugins.AddFromPromptDirectory(Path.Combine(AppContext.BaseDirectory, "plugins",
                "CodeAnalysis"));

            var kernel = kernelBuilder.Build();

            return kernel;
        }));
    }
}