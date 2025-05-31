using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class GeoLocation
{
    [Key]
    public int GeoId { get; set; }
    public required Point Coords { get; set; }
    public required string RockType { get; set; }
    public required string SoilType { get; set; }
    public required string Age { get; set; }
}