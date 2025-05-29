using NetTopologySuite.Geometries;

public class GeoLocation
{
    public int GeoId { get; set; }
    public required Point Coords { get; set; }
    public required string RockType { get; set; }
    public required string SoilType { get; set; }
    public required string Age { get; set; }
}