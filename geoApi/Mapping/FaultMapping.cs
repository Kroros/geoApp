using geoApi.Entities;
using geoApi.Dtos;

namespace geoApi.Mapping;

public static class FaultMapping
{
    public static FaultDto FaultToDto(this FaultDto fault)
    {
        return new(
            fault.FaultId,
            fault.FaultLoc,
            fault.FaultType
        );
    }
}