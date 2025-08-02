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
            id: responseData.volcanoid,
            name: responseData.volcanoname,
            type: responseData.volcanotype,
            region: responseData.volcanicregion,
            lastEruption: responseData.lasteruption,
            setting: responseData.tectonicsetting,
            rockType: responseData.rocktype,
            location: { lat: responseData.volcanolat, lng: responseData.volcanolon },
            elevation: responseData.elevation,
            country: responseData.volcanocountry
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
        region: "",
        lastEruption: 0,
        setting: "",
        rockType: "",
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
            id: responseData.craterid,
            name: responseData.cratername,
            diameter: responseData.craterdiameter,
            age: responseData.craterage,
            location: { lat: responseData.craterlat, lng: responseData.craterlon },
            ageCertainty: responseData.agecertainty
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
            id: responseData.depid,
            name: responseData.depname,
            country: responseData.depcountry,
            type: responseData.deptype,
            location: { lat: responseData.deplat, lng: responseData.deplon },
            commodity: responseData.depcommodity
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