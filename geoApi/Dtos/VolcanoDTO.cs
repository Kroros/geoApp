namespace geoApi.Dtos;

public record class VolcanoDto(
    int id,
    string volcanoname,
    string volcanotype,
    string volcanicregion,
    int? lasteruption,
    int elevation,
    string? tectonicsetting,
    string? rocktype,
    double volcanolat,
    double volcanolon,
    string volcanocountry
);