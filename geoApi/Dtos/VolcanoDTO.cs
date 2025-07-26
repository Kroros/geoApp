namespace geoApi.Dtos;

public record class VolcanoDto(
    int Id,
    string VolcanoName,
    string VolcanoType,
    int? LastEruption,
    double VolcanoLat,
    double VolcanoLon,
    int VolcanoElevation,
    string VolcanoCountry
);