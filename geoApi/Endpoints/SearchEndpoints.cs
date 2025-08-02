using geoApi.Data;
using geoApi.Mapping;
using NetTopologySuite.Geometries;
using Microsoft.EntityFrameworkCore;
using geoApi.GCDist;
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
                var volcanoes = await dbContext.volcanoes
                .Where(v => v.volcanoname.ToLower().Contains(query) &&
                            (v.elevation >= minElevation) &&
                            (v.elevation <= maxElevation) &&
                            countries.Any(c => 
                                v.volcanocountry.ToLower().Contains(c.ToLower())))
                .Select(v => v.VolToDto())
                .AsNoTracking()
                .ToListAsync();

                foreach (var v in volcanoes)
                {
                    if (point.GCDistance(new Point(v.volcanolon, v.volcanolat)) <= maxDistance &&
                    point.GCDistance(new Point(v.volcanolon, v.volcanolat)) >= minDistance)
                    {
                        results.Add(v);
                    }
                }
            }

            if (geoFeature.Contains("mineralDeposits"))
            {
                var minerals = await dbContext.minerals
                .Where(m => m.depname.ToLower().Contains(query) &&
                            countries.Contains(m.depcountry) &&
                            commodities.Any(c => 
                                m.depcommodity.ToLower().Contains(c.ToLower()))
                )
                .Select(m => m.MinToDto())
                .AsNoTracking()
                .ToListAsync();

                foreach (var m in minerals)
                {
                    if (point.GCDistance(new Point(m.deplon, m.deplat)) <= maxDistance &&
                    point.GCDistance(new Point(m.deplon, m.deplat)) >= minDistance)
                    {
                        results.Add(m);
                    }
                }
            }


            if (geoFeature.Contains("impactCraters"))
            {
                var craters = await dbContext.meteoriccraters
                .Where(c => c.cratername.ToLower().Contains(query) &&
                (c.craterlocation != null) &&
                (c.craterdiameter >= minDiameter) &&
                (c.craterdiameter <= maxDiameter))
                .Select(c => c.CraterToDto())
                .AsNoTracking()
                .ToListAsync();

                foreach (var c in craters)
                {
                    if (point.GCDistance(new Point(c.craterlon, c.craterlat)) <= maxDistance)
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