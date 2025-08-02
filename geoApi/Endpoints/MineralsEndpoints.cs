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

        //Get deposit by Id
        group.MapGet("/{depId}", async (int depId, GeoContext dbContext) =>
        {
            Mineral? deposit = await dbContext.minerals.FindAsync(depId);

            return deposit is null ? Results.NotFound() : Results.Ok(deposit.MinToDto());
        });

        //GET all mineral deposits
        group.MapGet("/", async (GeoContext dbContext) =>
        {
            var deposits = await dbContext.minerals
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(deposits);
        });

        //GET nearest deposit
        group.MapGet("/nearest", async (double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var deposits = await dbContext.minerals
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = deposits
                .OrderBy(m => point.GCDistance(new Point(m.deplon, m.deplat)))
                .First();

            return Results.Ok(nearest);
        });

        //GET deposits by commodity
        group.MapGet("/byCommodity", async (string commodity, GeoContext dbContext) =>
        {
            var deposits = await dbContext.minerals
                .Where(m => m.depcommodity.ToLower().Contains(commodity))
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(deposits);
        });

        //GET nearest deposit by commodity
        group.MapGet("/nearestByCommodity", async (string commodity, double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var deposits = await dbContext.minerals
                .Where(m => m.depcommodity.ToLower().Contains(commodity))
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = deposits
                .OrderBy(m => point.GCDistance(new Point(m.deplon, m.deplat)))
                .First();

            return Results.Ok(nearest);
        });

        //GET deposits with like name
        group.MapGet("/search", async (string search, GeoContext dbContext) =>
        {
            var minerals = await dbContext.minerals
                .Where(m => m.depname.ToLower().Contains(search))
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(minerals);
        });

        return group;
    }
}