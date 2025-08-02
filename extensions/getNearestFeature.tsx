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
                id: responseData.volcanoid,
                name: responseData.volcanoname,
                type: responseData.volcanotype,
                region: responseData.volcanicregion,
                lastEruption: responseData.lasteruption,
                elevation: responseData.volcanoelevation,
                setting: responseData.tectonicsetting,
                rockType: responseData.rocktype,
                location: { lat: responseData.volcanolat, lng: responseData.volcanolon },
                country: responseData.volcanocountry
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
                id: responseData.craterid,
                name: responseData.cratername,
                diameter: responseData.craterdiameter,
                age: responseData.craterage,
                location: { lat: responseData.craterlat, lng: responseData.craterlon },
                ageCertainty: responseData.agecertainty
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
                id: responseData.depid,
                name: responseData.depname,
                country: responseData.depcountry,
                type: responseData.deptype,
                location: { lat: responseData.deplat, lng: responseData.deplon },
                commodity: responseData.depcommodity
            });
        })
        .catch((error) => {
            console.log(error)
        });
}