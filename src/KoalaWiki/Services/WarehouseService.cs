using FastService;
using KoalaWiki.DbAccess;
using KoalaWiki.Dto;
using KoalaWiki.Entities;
using KoalaWiki.KoalaWarehouse;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace KoalaWiki.Services;

public class WarehouseService(KoalaDbAccess access, IMapper mapper, WarehouseStore warehouseStore) : FastApi
{
    /// <summary>
    /// 提交仓库
    /// </summary>
    public async Task SubmitWarehouseAsync(WarehouseInput input)
    {
        // 判断这个仓库是否已经添加
        if (await access.Warehouses.AnyAsync(x => x.Address == input.Address))
        {
            throw new Exception("存在相同名称的渠道");
        }

        var entity = mapper.Map<Warehouse>(input);
        entity.Name = string.Empty;
        entity.Description = string.Empty;
        entity.Version = string.Empty;

        entity.Id = Guid.NewGuid().ToString();
        await access.Warehouses.AddAsync(entity);

        await access.SaveChangesAsync();

        await warehouseStore.WriteAsync(entity);
    }
}