﻿using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using KoalaWiki.Entities;
using KoalaWiki.Entities.DocumentFile;
using Microsoft.EntityFrameworkCore;

namespace KoalaWiki.Core.DataAccess;

public class KoalaWikiContext<TContext>(DbContextOptions<TContext> options)
    : DbContext(options), IKoalaWikiContext where TContext : DbContext
{
    public DbSet<Warehouse> Warehouses { get; set; }

    public DbSet<DocumentCatalog> DocumentCatalogs { get; set; }

    public DbSet<Document> Documents { get; set; }

    public DbSet<DocumentFileItem> DocumentFileItems { get; set; }

    public DbSet<DocumentFileItemSource> DocumentFileItemSources { get; set; }

    public DbSet<DocumentOverview> DocumentOverviews { get; set; }
    
    public DbSet<DocumentCommitRecord> DocumentCommitRecords { get; set; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        return await base.SaveChangesAsync(cancellationToken);
    }

    public async Task RunMigrateAsync()
    {
        await Database.MigrateAsync();
    }

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

            builder.HasIndex(x => x.Address);

            builder.HasIndex(x => x.Type);

            builder.HasIndex(x => x.Branch);

            builder.HasIndex(x => x.OrganizationName);
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

        modelBuilder.Entity<DocumentOverview>(options =>
        {
            options.HasKey(x => x.Id);

            options.Property(x => x.Title).IsRequired();

            options.HasIndex(x => x.DocumentId);

            options.HasIndex(x => x.Title);
        });

        modelBuilder.Entity<DocumentCommitRecord>(options =>
        {
            options.HasKey(x => x.Id);

            options.Property(x => x.CommitMessage).IsRequired();
            
            options.Property(x => x.Author).IsRequired();

            options.HasIndex(x => x.WarehouseId);

            options.HasIndex(x => x.CommitId);
        });
    }
}