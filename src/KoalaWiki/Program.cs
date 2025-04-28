using KoalaWiki.DbAccess;
using KoalaWiki.Git;
using KoalaWiki.KoalaWarehouse;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new Serilog.LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .CreateLogger();

builder.Services.AddSerilog(Log.Logger);

builder.Services.AddOpenApi();
builder.Services.WithFast();
builder.Services.AddSingleton<WarehouseStore>();
builder.Services.AddSingleton<GitService>();
builder.Services.AddSingleton<DocumentsService>();

builder.Services
    .AddCors(options =>
    {
        options.AddPolicy("AllowAll",
            builder => builder
                .SetIsOriginAllowed(_ => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
    });

builder.Services.AddHostedService<WarehouseTask>();

builder.Services.AddDbContext<KoalaDbAccess>(optionsBuilder =>
{
    optionsBuilder.UseSqlite(builder.Configuration.GetConnectionString("Default"));
});

builder.Services.AddMapster();

var app = builder.Build();

app.UseCors("AllowAll");
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapFast();


app.Run();