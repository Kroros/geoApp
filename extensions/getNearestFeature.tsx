import axios from "axios";
import Config from "../app/config";
import type {Coords, Volcano, Crater, Deposit} from "../types/types";


export function getNearestVolcano(latitude: number, longitude: number, setNearestVolc: React.Dispatch<React.SetStateAction<Volcano>>) {
    const volcanoLink = `${Config.SERVER_URL}/volcanoes/nearest?lat=${latitude}&lon=${longitude}`;
    
    axios
        .get(volcanoLink)
        .then((response) => {
            const responseData = response.data;

            setNearestVolc({
                fType: "volcano",
                id: responseData.volcanoId,
                name: responseData.volcanoName,
                type: responseData.volcanoType,
                lastEruption: responseData.lastEruption,
                location: { lat: responseData.volcanoLat, lng: responseData.volcanoLon },
                elevation: responseData.volcanoElevation
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

export function getNearestCrater(latitude: number, longitude: number, setNearestCrater: React.Dispatch<React.SetStateAction<Crater>>) {
    const craterLink = `${Config.SERVER_URL}/meteoricCraters/nearest?lat=${latitude}&lon=${longitude}`;

    axios
        .get(craterLink)
        .then((response) => {
            const responseData = response.data;

            setNearestCrater({
                fType: "crater",
                id: responseData.craterId,
                name: responseData.craterName,
                diameter: responseData.craterDiameter,
                age: responseData.craterAge,
                location: { lat: responseData.craterLat, lng: responseData.craterLon },
                ageCertainty: responseData.ageCertainty
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

export function getNearestDeposit(latitude: number, longitude: number, setNearestDeposit: React.Dispatch<React.SetStateAction<Deposit>>) {
    const depositLink = `${Config.SERVER_URL}/minerals/nearest?lat=${latitude}&lon=${longitude}`

    axios
        .get(depositLink)
        .then((response) => {
            const responseData = response.data;

            setNearestDeposit({
                fType: "deposit",
                id: responseData.depId,
                name: responseData.depName,
                country: responseData.depCountry,
                type: responseData.depType,
                location: { lat: responseData.depLat, lng: responseData.depLon },
                commodity: responseData.depCommodity
            });
        })
        .catch((error) => {
            console.log(error)
        });
}