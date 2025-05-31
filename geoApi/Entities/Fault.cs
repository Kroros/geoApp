using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class Fault
{
    [Key]
    public int FaultId { get; set; }
    public required LineString FaultLoc { get; set; }
    public required string FaultType { get; set; }
}