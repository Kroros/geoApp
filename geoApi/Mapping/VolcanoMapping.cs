using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Mapping;

public static class VolcanoMapping
{
    public static VolcanoDto VolToDto(this Volcano volcano)
    {
        return new(
            volcano.id,
            volcano.volcanoname,
            volcano.volcanotype,
            volcano.volcanicregion,
            volcano.lasteruption,
            volcano.elevation,
            volcano.tectonicsetting,
            volcano.rocktype,
            volcano.volcanolocation.Y,
            volcano.volcanolocation.X,
            volcano.volcanocountry
        );
    }
}