using geoApi.Data;
using geoApi.Mapping;
using NetTopologySuite.Geometries;
using Microsoft.EntityFrameworkCore;
using geoApi.GCDist;
using System.Text.Json;
using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Endpoints;

public static class VolcanoEndpoints
{
    
    public static RouteGroupBuilder MapVolcanoEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("volcanoes");

        //GET volcano by Id
        group.MapGet("/{id}", async (int id, GeoContext dbContext) =>
        {
            Volcano? volcano = await dbContext.volcanoes.FindAsync(id);

            return volcano is null ? Results.NotFound() : Results.Ok(volcano.VolToDto());
        });

        //GET nearest volcano
        group.MapGet("/nearest", async (double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var volcanoes = await dbContext.volcanoes
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = volcanoes
                .OrderBy(v => point.GCDistance(new Point(v.volcanolon, v.volcanolat)))
                .First();

            return Results.Ok(nearest);
        });

        //GET volcanoes
        group.MapGet("/", async (GeoContext dbContext) =>
        {
            var volcanoes = await dbContext.volcanoes
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(volcanoes);
        });

        //GET volcanoes with like name
        group.MapGet("/search", async (string search, GeoContext dbContext) =>
        {
            var volcanoes = await dbContext.volcanoes
                .Where(v => v.volcanoname.ToLower().Contains(search))
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(volcanoes);
        });

        return group;
    }
}
