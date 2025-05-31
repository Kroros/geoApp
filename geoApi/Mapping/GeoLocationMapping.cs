using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Mapping;

public static class GeoLocMapping
{
    public static GeoLocDto GlToDto(this GeoLocation geoloc)
    {
        return new(
            geoloc.GeoId,
            geoloc.Coords,
            geoloc.RockType,
            geoloc.SoilType,
            geoloc.Age
        );
    }
}