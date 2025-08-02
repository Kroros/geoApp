using geoApi.Data;
using geoApi.Mapping;
using NetTopologySuite.Geometries;
using Microsoft.EntityFrameworkCore;
using geoApi.GCDist;
using System.Text.Json;
using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Endpoints;

public static class CraterEndpoints
{
    public static RouteGroupBuilder MapCraterEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("meteoricCraters");

        //GET crater by Id
        group.MapGet("/{craterId}", async (int craterId, GeoContext dbContext) =>
        {
            Crater? crater = await dbContext.meteoriccraters.FindAsync(craterId);

            return crater is null ? Results.NotFound() : Results.Ok(crater.CraterToDto());
        });

        //GET all craters with known location
        group.MapGet("/", async (GeoContext dbContext) =>
        {
            var craters = await dbContext.meteoriccraters
                .Where(c => c.craterlocation != null)
                .Select(c => c.CraterToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(craters);
        });

        //GET nearest crater
        group.MapGet("/nearest", async (double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var craters = await dbContext.meteoriccraters
                .Where(c => c.craterlocation != null)
                .Select(c => c.CraterToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = craters
                .OrderBy(c => point.GCDistance(new Point(c.craterlon, c.craterlat)))
                .First();

            return Results.Ok(nearest);
        });

        //GET craters with like name
        group.MapGet("/search", async (string search, GeoContext dbContext) =>
        {
            var craters = await dbContext.meteoriccraters
                .Where(c => c.cratername.ToLower().Contains(search) && (c.craterlocation != null))
                .Select(c => c.CraterToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(craters);
        });

        return group;
    }
}