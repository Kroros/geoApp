using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class Crater
{
    [Key]
    public int CraterId { get; set; }
    public required string CraterName { get; set; }
    public double? CraterDiameter { get; set; }
    public double? CraterAge { get; set; }
    public Point? CraterLocation { get; set; }
    public string? AgeCertainty { get; set; }
}