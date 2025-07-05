using geoApi.Data;
using geoApi.Mapping;
using NetTopologySuite.Geometries;
using Microsoft.EntityFrameworkCore;
using geoApi.GCDist;
using System.Text.Json;
using geoApi.Dtos;
using geoApi.Entities;
using System.Threading.Tasks;

namespace geoApi.Endpoints;

public static class MineralsEndpoints
{
    public static RouteGroupBuilder MapMineralsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("minerals");

        //GET all mineral deposits
        group.MapGet("/", async (GeoContext dbContext) =>
        {
            var deposits = await dbContext.Minerals
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(deposits);
        });

        //GET nearest deposit
        group.MapGet("/nearest", async (double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var deposits = await dbContext.Minerals
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = deposits
                .OrderBy(m => point.GCDistance(new Point(m.DepLon, m.DepLat)))
                .First();

            return Results.Ok(nearest);
        });

        //GET deposits by commodity
        group.MapGet("/byCommodity", async (string commodity, GeoContext dbContext) =>
        {
            var deposits = await dbContext.Minerals
                .Where(m => m.DepCommodity.ToLower().Contains(commodity))
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(deposits);
        });

        //GET nearest deposit by commodity
        group.MapGet("/nearestByCommodity", async (string commodity, double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var deposits = await dbContext.Minerals
                .Where(m => m.DepCommodity.ToLower().Contains(commodity))
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = deposits
                .OrderBy(m => point.GCDistance(new Point(m.DepLon, m.DepLat)))
                .First();

            return Results.Ok(nearest);
        });

        //GET deposits with like name
        group.MapGet("/search", async (string search, GeoContext dbContext) =>
        {
            var minerals = await dbContext.Minerals
                .Where(m => m.DepName.ToLower().Contains(search))
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(minerals);
        });

        return group;
    }
}