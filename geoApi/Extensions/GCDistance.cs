using NetTopologySuite.Geometries;
using System;
using System.Net.NetworkInformation;

namespace geoApi.GCDist;

public static class GeoExtensions
{
    public static double GCDistance(this Point p1, Point p2)
    {
        const double R = 6371000;

        double lat1 = p1.Y * Math.PI / 180;
        double lon1 = p1.X * Math.PI / 180;
        double lat2 = p2.Y * Math.PI / 180;
        double lon2 = p2.X * Math.PI / 180;

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        double a = Math.Pow(Math.Cos(lat2) * Math.Sin(dLon), 2) +
                   Math.Pow(Math.Cos(lat1) * Math.Sin(lat2) - Math.Sin(lat1) * Math.Cos(lat2) * Math.Cos(dLon), 2);
        double b = Math.Sqrt(a);
        double c = Math.Sin(lat1) * Math.Sin(lat2) +
                   Math.Cos(lat1) * Math.Cos(lat2) * Math.Cos(dLon);
        double dSigma = Math.Atan2(b, c);
        return R * dSigma;
    }
}