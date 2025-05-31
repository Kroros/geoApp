using NetTopologySuite.Geometries;

namespace geoApi.Dtos;

public record class VolcanoDto(
    int Id,
    string VolcanoName,
    string VolcanoType,
    int? LastEruption,
    Point VolcanoLocation,
    int VolcanoElevation
);