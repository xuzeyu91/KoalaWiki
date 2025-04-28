using System.Diagnostics;
using Serilog;

namespace KoalaWiki;

public class KoalaHttpClientHandler : HttpClientHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        // 1. 启动计时
        var stopwatch = Stopwatch.StartNew();
        // 2. 发送请求
        var response = await base.SendAsync(request, cancellationToken)
            .ConfigureAwait(false);
        // 3. 停止计时
        stopwatch.Stop();
        // 4. 记录简洁日志
        Log.Logger.Information(
            "HTTP {Method} {Uri} => {StatusCode} in {ElapsedMilliseconds}ms",
            request.Method,
            request.RequestUri,
            (int)response.StatusCode,
            stopwatch.ElapsedMilliseconds
        );
        return response;
    }
}