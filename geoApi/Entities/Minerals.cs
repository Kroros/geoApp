using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace geoApi.Entities;

public class Mineral
{
    [Key]
    public int depid { get; set; }
    public required Point deplocation { get; set; }
    public required string depname { get; set; }
    public required string depcountry { get; set; }
    public required string depcommodity { get; set; }
    public required string deptype { get; set; }

}