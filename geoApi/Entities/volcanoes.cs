using NetTopologySuite.Geometries;

public class Volcano
{
    public int VolcanoId { get; set; }
    public required string VolcanoName { get; set; }
    public required string VolcanoType { get; set; }
    public int? LastEruption { get; set; }
    public required Point Location { get; set; }
    public int Elevation { get; set; }
}