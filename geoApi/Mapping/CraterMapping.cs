using geoApi.Dtos;
using geoApi.Entities;

namespace geoApi.Mapping;

public static class CraterMapping
{
    public static CraterDto CraterToDto(this Crater crater)
    {
        return new CraterDto(
            crater.CraterId,
            crater.CraterName,
            crater.CraterDiameter,
            crater.CraterAge,
            crater.CraterLocation.Y,
            crater.CraterLocation.X,
            crater.AgeCertainty
        );
    }
}