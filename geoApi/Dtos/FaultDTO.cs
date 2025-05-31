using NetTopologySuite.Geometries;

namespace geoApi.Dtos;

public record class FaultDto(
    int FaultId,
    LineString FaultLoc,
    string FaultType
);