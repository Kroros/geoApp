using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class Mineral
{
    [Key]
    public int Id { get; set; }
    public required Point DepLocation { get; set; }
    public required string DepName { get; set; }
    public required string DepCountry { get; set; }
    public required string DepCommodity { get; set; }
    public required string DepType { get; set; }

}