using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Mapping;

public static class CraterMapping
{
    public static CraterDto CraterToDto(this Crater crater)
    {
        return new CraterDto(
            crater.craterid,
            crater.cratername,
            crater.craterdiameter,
            crater.craterage,
            crater.craterlocation.Y,
            crater.craterlocation.X,
            crater.agecertainty
        );
    }
}