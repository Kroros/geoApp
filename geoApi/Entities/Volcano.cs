using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class Volcano
{
    [Key]
    public int Id { get; set; }
    public required string VolcanoName { get; set; }
    public required string VolcanoType { get; set; }
    public int? LastEruption { get; set; }
    public required Point VolcanoLocation { get; set; }
    public int VolcanoElevation { get; set; }
    public required string VolcanoCountry { get;  set; }
}