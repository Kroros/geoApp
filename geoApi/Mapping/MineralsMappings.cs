using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Mapping;

public static class MineralMapping
{
    public static MineralDto MinToDto(this Mineral mineral)
    {
        return new(
            mineral.Id,
            mineral.DepName,
            mineral.DepCountry,
            mineral.DepCommodity,
            mineral.DepType,
            mineral.DepLocation.Y,
            mineral.DepLocation.X
        );
    }
}