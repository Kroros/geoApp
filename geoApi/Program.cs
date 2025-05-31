using geoApi.Data;
using geoApi.Endpoints;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GeoContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.UseNetTopologySuite()
    )
);

var app = builder.Build();

app.MapVolcanoEndpoints();

app.Run();
