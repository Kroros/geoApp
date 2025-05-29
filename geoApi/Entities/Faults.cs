using NetTopologySuite.Geometries;

public class Fault
{
    public int FaultId { get; set; }
    public required LineString FaultLoc { get; set; }
    public required String FaultType { get; set; }
}