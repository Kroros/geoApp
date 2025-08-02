namespace geoApi.Dtos;

public record class CraterDto(
    int CraterId,
    string cratername,
    double? craterdiameter,
    double? craterage,
    double craterlat,
    double craterlon,
    string? agecertainty
);