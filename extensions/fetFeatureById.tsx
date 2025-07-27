import axios from "axios";
import Config from "../app/config";
import { Crater, Deposit, Volcano } from "../types/types";

export async function getVolcanoById(id: number) {
    const requestLink = `${Config.SERVER_URL}/volcanoes/${id}`

    try {
        const response = await axios.get(requestLink);
        const responseData = response.data;

        const vol: Volcano = {
            fType: "volcano",
            id: responseData.volcanoId,
            name: responseData.volcanoName,
            type: responseData.volcanoType,
            lastEruption: responseData.lastEruption,
            location: { lat: responseData.volcanoLat, lng: responseData.volcanoLon },
            elevation: responseData.volcanoElevation,
            country: responseData.volcanoCountry
        }

        return vol;
    } catch (error) {
        console.log(error);
    }

    return {
        fType: "volcano",
        id: 0,
        name: "",
        type: "",
        lastEruption: 0,
        location: {lat: 0, lng: 0},
        elevation: 0,
        country: ""
    }
}


export async function getCraterById(id: number) {
    const requestLink = `${Config.SERVER_URL}/meteoricCraters/${id}`

    try {
        const response = await axios.get(requestLink);
        const responseData = response.data;

        const crater: Crater = {
            fType: "crater",
            id: responseData.craterId,
            name: responseData.craterName,
            diameter: responseData.craterDiameter,
            age: responseData.craterAge,
            location: { lat: responseData.craterLat, lng: responseData.craterLon },
            ageCertainty: responseData.ageCertainty
        }

        return crater;
    } catch (error) {
        console.log(error);
    }

    return {
        fType: "crater",
        id: 0,
        name: "",
        diameter: 0,
        age: 0,
        location: {lat: 0, lng: 0},
        ageCertainty: ""
    }
}


export async function getDepositById(id: number) {
    const requestLink = `${Config.SERVER_URL}/minerals/${id}`

    try {
        const response = await axios.get(requestLink);
        const responseData = response.data;

        const dep: Deposit = {
            fType: "deposit",
            id: responseData.depId,
            name: responseData.depName,
            country: responseData.depCountry,
            type: responseData.depType,
            location: { lat: responseData.depLat, lng: responseData.depLon },
            commodity: responseData.depCommodity
        }

        return dep;
    } catch (error) {
        console.log(error);1
    }

    return {
        fType: "deposit",
        id: 0,
        name: "",
        country: "",
        type: "",
        location: {lat: 0, lng: 0},
        commodity: ""
    }
}