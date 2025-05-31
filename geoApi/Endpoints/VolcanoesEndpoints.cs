using geoApi.Data;
using geoApi.Mapping;
using NetTopologySuite.Geometries;
using Microsoft.EntityFrameworkCore;
using geoApi.GCDist;
using System.Text.Json;
using geoApi.Dtos;

namespace geoApi.Endpoints;



public static class VolcanoEndpoints
{
    
    public static RouteGroupBuilder MapVolcanoEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("volcanoes");

        group.MapGet("/nearest", async (double lat, double lon, GeoContext dbContext) =>
        {
            var point = new Point(lon, lat) { SRID = 4326 };

            /* var minDistance = await dbContext.Volcanoes
                .MinAsync(v => v.VolcanoLocation.GCDistance(point));

            var nearestVolcanoes = await dbContext.Volcanoes
                .Where(v => v.VolcanoLocation.GCDistance(point) <= minDistance)
                .Select(v => v.VolToDto())
                .ToListAsync(); */

            var volcanoes = await dbContext.Volcanoes
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

            var nearest = volcanoes
                .OrderBy(v => point.GCDistance(new Point(v.VolcanoLon, v.VolcanoLat)))
                .First();

            /* var jsonString = "{ \"Id\": " + nearest.Id.ToString() + ", \"VolcanoName\": \""+ nearest.VolcanoName + "\", \"VolcanoType\": \"" + nearest.VolcanoType +"\", \"LastEruption\": " + nearest.LastEruption.ToString() +", \"VolcanoLocation\": \""+ nearest.VolcanoLocation.ToString() +"\", \"VolcanoElevation\": "+ nearest.VolcanoElevation.ToString() +" }";

            VolcanoDto? volcano = JsonSerializer.Deserialize<VolcanoDto>(jsonString); */

            Console.WriteLine(nearest.Id);
            Console.WriteLine(nearest.VolcanoName);
            Console.WriteLine(nearest.VolcanoType);
            Console.WriteLine(nearest.LastEruption);
            Console.WriteLine(nearest.VolcanoLat);
            Console.WriteLine(nearest.VolcanoLon);
            Console.WriteLine(nearest.VolcanoElevation);

            return Results.Ok(nearest);
        });

        return group;
    }
}
