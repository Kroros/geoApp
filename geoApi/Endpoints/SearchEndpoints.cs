using geoApi.Data;
using geoApi.Mapping;
using NetTopologySuite.Geometries;
using Microsoft.EntityFrameworkCore;
using geoApi.GCDist;
using System.Text.Json;
using geoApi.Dtos;
using geoApi.Entities;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;

namespace geoApi.Endpoints;

public static class SearchEndpoints
{
    public static RouteGroupBuilder MapSearchEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("search");
        //GET all items matching search query
        group.MapGet("/", async (
            string query,
            [FromQuery] double lat,
            [FromQuery] double lng,
            [FromQuery] string[] geoFeature,
            [FromQuery] string[] countries,
            [FromQuery] string[] commodities,
            [FromQuery] int? minElevation,
            [FromQuery] int? maxElevation,
            [FromQuery] int? minDiameter,
            [FromQuery] int? maxDiameter,
            [FromQuery] int? minDistance,
            [FromQuery] int? maxDistance,
            IOptions<SearchDefaults> config,
            GeoContext dbContext) =>
        {
            var point = new Point(lng, lat) { SRID = 4326 };

            if (geoFeature.Length == 0)
            {
                geoFeature = config.Value.DefaultFeatureSelection.ToArray();
            }
            if (countries.Length == 0)
            {
                countries = config.Value.DefaultCountrySelection.ToArray();
            }
            if (commodities.Length == 0)
            {
                commodities = config.Value.DefaultCommoditySelection.ToArray();
            }
            minElevation ??= 0;
            maxElevation ??= 999999999;
            minDiameter ??= 0;
            maxDiameter ??= 999999999;
            minDistance ??= 0;
            maxDistance ??= 999999999;

            query = query.ToLower();

            var results = new List<object>();

            if (geoFeature.Contains("volcanoes"))
            {
                var volcanoes = await dbContext.Volcanoes
                .Where(v => v.VolcanoName.ToLower().Contains(query) &&
                            (v.VolcanoElevation >= minElevation) &&
                            (v.VolcanoElevation <= maxElevation))
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

                foreach (var v in volcanoes)
                {
                    if (point.GCDistance(new Point(v.VolcanoLon, v.VolcanoLat)) <= maxDistance &&
                    point.GCDistance(new Point(v.VolcanoLon, v.VolcanoLat)) >= minDistance)
                    {
                        results.Add(v);
                    }
                }
            }

            if (geoFeature.Contains("mineralDeposits"))
            {
                var minerals = await dbContext.Minerals
                .Where(m => m.DepName.ToLower().Contains(query) &&
                            countries.Contains(m.DepCountry) &&
                            commodities.Any(c => 
                                m.DepCommodity.ToLower().Contains(c.ToLower()))
                )
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

                foreach (var m in minerals)
                {
                    if (point.GCDistance(new Point(m.DepLon, m.DepLat)) <= maxDistance &&
                    point.GCDistance(new Point(m.DepLon, m.DepLat)) >= minDistance)
                    {
                        results.Add(m);
                    }
                }
            }


            if (geoFeature.Contains("impactCraters"))
            {
                var craters = await dbContext.MeteoricCraters
                .Where(c => c.CraterName.ToLower().Contains(query) &&
                (c.CraterLocation != null) &&
                (c.CraterDiameter >= minDiameter) &&
                (c.CraterDiameter <= maxDiameter))
                .Select(c => c.CraterToDto())
                .AsNoTracking()
                .ToListAsync();

                foreach (var c in craters)
                {
                    if (point.GCDistance(new Point(c.CraterLon, c.CraterLat)) <= maxDistance)
                    {
                        results.Add(c);
                    }
                }
            }
            

            return Results.Ok(results);
        });

        return group;
    }
}