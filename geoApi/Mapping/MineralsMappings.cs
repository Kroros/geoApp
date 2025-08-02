using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Mapping;

public static class MineralMapping
{
    public static MineralDto MinToDto(this Mineral mineral)
    {
        return new(
            mineral.depid,
            mineral.depname,
            mineral.depcountry,
            mineral.depcommodity,
            mineral.deptype,
            mineral.deplocation.Y,
            mineral.deplocation.X
        );
    }
}