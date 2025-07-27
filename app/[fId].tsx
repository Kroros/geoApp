import { getCraterById, getDepositById, getVolcanoById } from "@/extensions/fetFeatureById";
import type { Crater, Deposit, Volcano } from "../types/types";
import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useState } from "react";
import { View, Text } from "react-native"
import { craterAge, formatCoords, volcanoActivity } from "@/extensions/formatting";

export default function FeatureInfoScreen() {
    const { fId }: {fId: string} = useLocalSearchParams();
    const [ title, setTitle ] = useState<string>("");
    const [ vInfo, setVInfo ] = useState<Volcano>({
        fType: "volcano",
        id: -1,
        name: "",
        type: "",
        lastEruption: 0,
        location: {lat: 0, lng: 0},
        elevation: 0,
        country: ""
    });

    const [ cInfo, setCInfo ] = useState<Crater>({
        fType: "crater",
        id: -1,
        name: "",
        diameter: 0,
        age: 0,
        location: {lat: 0, lng: 0},
        ageCertainty: ""
    })

    const [ dInfo, setDInfo ] = useState<Deposit>({
        fType: "deposit",
        id: -1,
        name: "",
        country: "",
        type: "",
        location: {lat: 0, lng: 0},
        commodity: ""
    })

    async function getFeature() {
        if (fId.includes("volcano")) {
            setVInfo(await getVolcanoById(parseInt(fId.replace("volcano", ""))));
            setTitle(vInfo.name);
        } else if (fId.includes("crater")) {
            setCInfo(await getCraterById(parseInt(fId.replace("crater", ""))));
            setTitle(cInfo.name);
        } else if (fId.includes("deposit")) {
            setDInfo(await getDepositById(parseInt(fId.replace("deposit", ""))));
            setTitle(dInfo.name);
        }
    }

    const navigation = useNavigation();

    useEffect(() => {
        getFeature();

        navigation.setOptions({
            headerShown: true,
            title: title
        });
    })

    function contentHandler() {
        if (vInfo.id != -1){
            return (
                <Text style={{color: "white"}}>
                    Volcano Name: {vInfo.name} {br}
                    Volcano Location: {formatCoords(vInfo.location.lat, vInfo.location.lng)} ({vInfo.country}) {br}
                    Elevation: {vInfo.elevation}m {br}
                    Volcano Type: {vInfo.type} {br}
                    Last Eruption: {volcanoActivity(vInfo.lastEruption)} {br}
                </Text>
            )
        } else if (cInfo.id != -1) {
            return (
                <Text style={{color: "white"}}>
                    Crater Name: {cInfo.name} {br}
                    Crater Location: {formatCoords(cInfo.location.lat, cInfo.location.lng)} {br}
                    Diameter: {cInfo.diameter}km {br}
                    Crater Age: {craterAge(cInfo.id, cInfo.age, cInfo.ageCertainty)} {br}
                </Text>
            )
        } else if (dInfo.id != -1) {
            return (
                <Text style={{color: "white"}}>
                    Deposit Name: {dInfo.name} {br}
                    Deposit Location: {formatCoords(dInfo.location.lat, dInfo.location.lng)} ({dInfo.country}) {br}
                    Commodities: {dInfo.commodity} {br}
                    Deposit Type: {dInfo.type} {br}
                </Text>
            )
        }
        
    }

    

    const br = "\n"; 
    return (
        <View>
            {contentHandler()}
        </View>
    )
}