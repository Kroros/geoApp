namespace geoApi.Dtos;

public record class MineralDto(
    int DepId,
    string DepName,
    string DepCountry,
    string DepCommodity,
    string DepType,
    double DepLat,
    double DepLon
);