using geoApi.Data;
using geoApi.Mapping;
using NetTopologySuite.Geometries;
using Microsoft.EntityFrameworkCore;

namespace geoApi.Endpoints;

public static class VolcanoEndpoints
{
    public static RouteGroupBuilder MapVolcanoEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("volcanoes");

        group.MapGet("/nearest", async (double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            var minDistance = await dbContext.Volcanoes
                .MinAsync(v => v.VolcanoLocation.Distance(point));

            var nearestVolcanoes = await dbContext.Volcanoes
                .Where(v => v.VolcanoLocation.Distance(point) <= minDistance)
                .Select(v => v.VolToDto())
                .ToListAsync();

            return Results.Ok(nearestVolcanoes);
        });

        return group;
    }
}
