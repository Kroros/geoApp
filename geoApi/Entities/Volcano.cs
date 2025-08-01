using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class Volcano
{
    [Key]
    public int id { get; set; }
    public required string volcanoname { get; set; }
    public required string volcanotype { get; set; }
    public required string volcanicregion { get; set; }
    public int? lasteruption { get; set; }
    public int elevation { get; set; }
    public string? tectonicsetting { get; set; }
    public string? rocktype { get; set; }
    public required Point volcanolocation { get; set; }
    
    public required string volcanocountry { get;  set; }
}