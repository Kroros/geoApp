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

        //GET nearest volcano
        group.MapGet("/nearest", async (double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var volcanoes = await dbContext.Volcanoes
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = volcanoes
                .OrderBy(v => point.GCDistance(new Point(v.VolcanoLon, v.VolcanoLat)))
                .First();

            return Results.Ok(nearest);
        });

        //GET volcanoes
        group.MapGet("/", async (GeoContext dbContext) =>
        {
            var volcanoes = await dbContext.Volcanoes
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(volcanoes);
        });

        return group;
    }
}
