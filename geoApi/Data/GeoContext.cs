using Microsoft.EntityFrameworkCore;
using geoApi.Entities;
using NetTopologySuite.Geometries;

namespace geoApi.Data;

class GeoContext : DbContext
{
    public GeoContext(DbContextOptions<GeoContext> options)
        : base(options) { }

    public DbSet<Volcano> Volcanoes => Set<Volcano>();
    public DbSet<GeoLocation> Geolocations => Set<GeoLocation>();
    public DbSet<Fault> Faults => Set<Fault>();
}