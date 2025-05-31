using NetTopologySuite.Geometries;

namespace geoApi.Dtos;

public record class GeoLocDto(
    int GeoId,
    Point Coords,
    string RockType,
    string SoilType,
    string Age
);