import type { Coords, Volcano, Crater, Deposit, Filter } from "../types/types";
import axios from "axios";
import Config from "../app/config";

export default async function useSearchLogic(query: string, signal: AbortSignal, { lat, lng }: Coords, filters: Filter, appendix: string): Promise<(Volcano | Crater | Deposit)[]> {
    const serverLink = `${Config.SERVER_URL}`;
    try {
        const response = await axios.get(`${serverLink}/search/?lat=${lat}&lng=${lng}&query=${query}&minElevation=${filters.elevation[0]}&maxElevation=${filters.elevation[1]}&minDistance=${filters.distance[0] * 1000}&maxDistance=${filters.distance[1] * 1000}` + appendix, { signal });
        const responseData = response.data;

        const results: (Volcano | Crater | Deposit)[] = [];

        responseData.slice().forEach((obj: any) => {
            if ("lastEruption" in obj){
                results.push({
                        fType: "volcano",
                        id: obj.id,
                        name: obj.volcanoName,
                        type: obj.volcanoType,
                        lastEruption: obj.lastEruption,
                        location: { lat: obj.volcanoLat, lng: obj.volcanoLon},
                        elevation: obj.volcanoElevation
                    })
            }
            else if ("craterDiameter" in obj){
                results.push({
                    fType: "crater",
                    id: obj.craterId,
                    name: obj.craterName,
                    diameter: obj.craterDiameter,
                    age: obj.craterAge,
                    location: { lat: obj.craterLat, lng: obj.craterLon },
                    ageCertainty: obj.ageCertainty
                })
            }
            else if ("depCommodity" in obj){
                results.push({
                    fType: "deposit",
                    id: obj.depId,
                    name: obj.depName,
                    country: obj.depCountry,
                    type: obj.depType,
                    location: { lat: obj.depLat, lng: obj.depLon },
                    commodity: obj.depCommodity
                });
            }
        });

        return results;
    } catch (error: any) {
        if (axios.isCancel(error)) {
            console.log("Request Cancelled")
        } else {
            console.log(error)
        }
        return [];
    }
}