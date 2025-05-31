using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Mapping;

public static class VolcanoMapping
{
    public static VolcanoDto VolToDto(this Volcano volcano)
    {
        return new(
            volcano.Id,
            volcano.VolcanoName,
            volcano.VolcanoType,
            volcano.LastEruption,
            volcano.VolcanoLocation.Y,
            volcano.VolcanoLocation.X,
            volcano.VolcanoElevation
        );
    }
}