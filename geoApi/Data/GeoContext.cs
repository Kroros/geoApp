using System;
using Microsoft.EntityFrameworkCore;

class GeoDb : DbContext
{
    public GeoDb(DbContextOptions<GeoDb> options)
        : base(options) { }

    public DbSet<Volcano> Volcanoes => Set<Volcano>();
    public DbSet<GeoLocation> Geolocations => Set<GeoLocation>();
    public DbSet<Fault> Faults => Set<Fault>();
}