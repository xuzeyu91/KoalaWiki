using System.Text.Json;
using KoalaWiki.Entities;
using KoalaWiki.Entities.DocumentFile;
using Microsoft.EntityFrameworkCore;

namespace KoalaWiki.DbAccess;

public class KoalaDbAccess(DbContextOptions<KoalaDbAccess> options) : DbContext(options)
{
    public DbSet<Warehouse> Warehouses { get; set; }

    public DbSet<DocumentCatalog> DocumentCatalogs { get; set; }

    public DbSet<Document> Documents { get; set; }

    public DbSet<DocumentFileItem> DocumentFileItems { get; set; }

    public DbSet<DocumentFileItemSource> DocumentFileItemSources { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Warehouse>((builder =>
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired();

            builder.Property(x => x.Description).IsRequired();

            builder.Property(x => x.CreatedAt).IsRequired();

            builder.HasIndex(x => x.Name);

            builder.HasIndex(x => x.Status);

            builder.HasIndex(x => x.CreatedAt);
        }));

        modelBuilder.Entity<DocumentCatalog>((builder =>
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired();

            builder.Property(x => x.Description).IsRequired();

            builder.Property(x => x.CreatedAt).IsRequired();

            builder.HasIndex(x => x.Name);

            builder.HasIndex(x => x.CreatedAt);

            builder.HasIndex(x => x.ParentId);

            builder.HasIndex(x => x.WarehouseId);

            builder.HasIndex(x => x.DucumentId);
        }));

        modelBuilder.Entity<Document>((builder =>
        {
            builder.HasKey(x => x.Id);


            builder.Property(x => x.Description).IsRequired();

            builder.Property(x => x.CreatedAt).IsRequired();

            builder.HasIndex(x => x.CreatedAt);

            builder.HasIndex(x => x.WarehouseId);
        }));

        modelBuilder.Entity<DocumentFileItem>((builder =>
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).IsRequired();

            builder.Property(x => x.Description).IsRequired();

            builder.Property(x => x.CreatedAt).IsRequired();

            builder.HasIndex(x => x.Title);

            builder.HasIndex(x => x.CreatedAt);

            builder.HasIndex(x => x.DocumentCatalogId);

            builder.Property(x => x.Metadata)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, (JsonSerializerOptions)null));

            builder.Property(x => x.Extra)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, (JsonSerializerOptions)null));
            
            
        }));

        modelBuilder.Entity<DocumentFileItemSource>((builder =>
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired();

            builder.Property(x => x.CreatedAt).IsRequired();

            builder.HasIndex(x => x.Name);

            builder.HasIndex(x => x.CreatedAt);

            builder.HasIndex(x => x.DocumentFileItemId);
        }));
    }
}