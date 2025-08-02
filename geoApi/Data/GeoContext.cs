using Microsoft.EntityFrameworkCore;
using geoApi.Entities;
using NetTopologySuite.Geometries;

namespace geoApi.Data;

class GeoContext : DbContext
{
    public GeoContext(DbContextOptions<GeoContext> options)
        : base(options) { }

    public DbSet<Volcano> volcanoes => Set<Volcano>();
    public DbSet<GeoLocation> geolocations => Set<GeoLocation>();
    public DbSet<Fault> faults => Set<Fault>();
    public DbSet<Crater> meteoriccraters => Set<Crater>();
    public DbSet<Mineral> minerals => Set<Mineral>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Volcano>()
            .Property(v => v.volcanolocation)
            .HasColumnType("geography");
    }
}