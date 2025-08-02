namespace geoApi.Dtos;

public record class MineralDto(
    int depid,
    string depname,
    string depcountry,
    string depcommodity,
    string deptype,
    double deplat,
    double deplon
);