import type { Coords, Volcano, Crater, Deposit, Filter } from "../types/types";
import axios from "axios";
import Config from "../app/config";
import React, { ReactNode } from "react";
import { TouchableWithoutFeedback, View, ScrollView, Text, StyleSheet } from "react-native";
import { formatCoords } from "./formatting";

export async function search(query: string, signal: AbortSignal, { lat, lng }: Coords, filters: Filter, appendix: string): Promise<(Volcano | Crater | Deposit)[]> {
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

export function buildAndSetDropdown(results: (Volcano | Crater | Deposit)[], setter: React.Dispatch<React.SetStateAction<ReactNode>>) {
    let list: ReactNode[] = [];

    results.forEach(obj => {
        if (obj.fType) {
            list.push((
                <TouchableWithoutFeedback key={obj.fType + obj.id.toString()} onPress={() => console.log(`Pressed on ${obj.name}`)}>
                    <View style={styles.result}>
                        <Text>
                            {obj.fType.toUpperCase()}: {obj.name}
                        </Text>
                        <Text>
                            Location: {formatCoords(obj.location.lat, obj.location.lng)}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            ))
        }
    })
    

    setter(
        <View style={{
            maxHeight: 300,
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
            minHeight: 300
            }}
        >
            <ScrollView
                style={styles.dropdown}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1}}
            >
                {list}
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        width: "100%",
        backgroundColor: "white",
    },
    result: {
        padding: 10
    }
})