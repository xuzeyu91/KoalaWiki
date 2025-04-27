using KoalaWiki.DbAccess;
using KoalaWiki.Entities;
using KoalaWiki.Git;

namespace KoalaWiki.KoalaWarehouse;

public class WarehouseTask(
    GitService gitService,
    WarehouseStore warehouseStore,
    ILogger<WarehouseTask> logger,
    IServiceProvider service)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var value = await warehouseStore.ReadAsync(stoppingToken);

                await using var scope = service.CreateAsyncScope();

                var dbContext = scope.ServiceProvider.GetService<KoalaDbAccess>();

                // 先拉取仓库
                var locaPath = await gitService.PullRepository(value.Address);

                var document = new Document()
                {
                    GitPath = locaPath,
                    WarehouseId = value.Id,
                    Status = WarehouseStatus.Pending,
                    Description = value.Description
                };

                await dbContext.Documents.AddAsync(document, stoppingToken);

                await dbContext.SaveChangesAsync(stoppingToken);
                
                
            }
            catch (Exception e)
            {
                logger.LogError("发生错误：{e}", e);
            }
        }
    }
}