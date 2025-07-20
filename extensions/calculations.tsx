import type { Coords } from "../types/types";

export function gcDistance(p1: Coords, p2: Coords){
    const r = 6371000;

    const lat1 = p1.lat * Math.PI / 180;
    const lat2 = p2.lat * Math.PI / 180;
    const lng1 = p1.lng * Math.PI / 180;
    const lng2 = p2.lng * Math.PI / 180;

    const dLng = lng1 - lng2;

    const a = Math.pow(Math.cos(lat2) * Math.sin(dLng), 2) +
                Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng), 2);
    const b = Math.sqrt(a);
    const c = Math.sin(lat1) * Math.sin(lat2) +
                   Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const dSigma = Math.atan2(b, c);

    return Math.round(r * dSigma);
}