using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class Crater
{
    [Key]
    public int craterid { get; set; }
    public required string cratername { get; set; }
    public double? craterdiameter { get; set; }
    public double? craterage { get; set; }
    public Point? craterlocation { get; set; }
    public string? agecertainty { get; set; }
}