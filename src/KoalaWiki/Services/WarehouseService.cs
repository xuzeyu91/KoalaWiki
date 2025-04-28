using FastService;
using KoalaWiki.DbAccess;
using KoalaWiki.Dto;
using KoalaWiki.Entities;
using KoalaWiki.KoalaWarehouse;
using LibGit2Sharp;
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
        if (await access.Warehouses.AnyAsync(x =>
                x.Address == input.Address &&
                (x.Status != WarehouseStatus.Completed || x.Status != WarehouseStatus.Pending )))
        {
            throw new Exception("存在相同名称的渠道");
        }
        
        // 删除旧的仓库
        var oldWarehouse = await access.Warehouses
            .Where(x => x.Address == input.Address)
            .ExecuteDeleteAsync();
      
        var entity = mapper.Map<Warehouse>(input);
        entity.Name = string.Empty;
        entity.Description = string.Empty;
        entity.Version = string.Empty;

        entity.Id = Guid.NewGuid().ToString();
        await access.Warehouses.AddAsync(entity);

        await access.SaveChangesAsync();

        await warehouseStore.WriteAsync(entity);
    }

    /// <summary>
    /// 获取仓库概述
    /// </summary>
    public async Task GetWarehouseOverviewAsync(string owner, string name, HttpContext context)
    {
        var query = await access.Warehouses
            .AsNoTracking()
            .Where(x => x.Name == name && x.OrganizationName == owner)
            .FirstOrDefaultAsync();

        // 如果没有找到仓库，返回空列表
        if (query == null)
        {
            throw new NotFoundException("仓库不存在");
        }

        var document = await access.Documents
            .AsNoTracking()
            .Where(x => x.WarehouseId == query.Id)
            .FirstOrDefaultAsync();

        var overview = await access.DocumentOverviews.FirstOrDefaultAsync(x => x.DocumentId == document.Id);

        if (overview == null)
        {
            throw new NotFoundException("没有找到概述");
        }

        await context.Response.WriteAsJsonAsync(new
        {
            content = overview.Content,
            title = overview.Title
        });
    }

    public async Task<PageDto<Warehouse>> GetWarehouseListAsync(int page, int pageSize)
    {
        var query = access.Warehouses
            .AsNoTracking()
            .Where(x => x.Status == WarehouseStatus.Completed);

        var total = await query.CountAsync();
        var list = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PageDto<Warehouse>(total, list);
    }
}