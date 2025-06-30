namespace geoApi.Dtos;

public record class CraterDto(
    int CraterId,
    string CraterName,
    double? CraterDiameter,
    double? CraterAge,
    double CraterLat,
    double CraterLon,
    string? AgeCertainty
);