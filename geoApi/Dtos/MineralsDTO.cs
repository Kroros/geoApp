namespace geoApi.Dtos;

public record class MineralDto(
    int Id,
    string DepName,
    string DepCountry,
    string DepCommodity,
    string DepType,
    double DepLat,
    double DepLon
);