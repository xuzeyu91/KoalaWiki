using KoalaWiki.DbAccess;
using KoalaWiki.Git;
using KoalaWiki.KoalaWarehouse;
using Mapster;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.WithFast();
builder.Services.AddSingleton<WarehouseStore>();
builder.Services.AddSingleton<GitService>();
builder.Services.AddSingleton<DocumentsService>();

builder.Services.AddDbContext<KoalaDbAccess>(optionsBuilder =>
{
    optionsBuilder.UseSqlite(builder.Configuration.GetConnectionString("Default"));
});

builder.Services.AddMapster();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapFast();


app.Run();