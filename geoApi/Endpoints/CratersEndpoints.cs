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

        //GET all craters with known location
        group.MapGet("/", async (GeoContext dbContext) =>
        {
            var craters = await dbContext.Craters
                                        .Select(c => c.CraterToDto())
                                        .Where(c => c.CraterLat != null)
                                        .AsNoTracking()
                                        .ToListAsync();

            return Results.Ok(craters);
        });

        return group;
    }
}