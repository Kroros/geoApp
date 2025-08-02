import type { Coords, Volcano, Crater, Deposit, Filter } from "../types/types";
import axios from "axios";
import Config from "../app/config";
import React, { ReactNode } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList, 
    Pressable} from "react-native";
import { formatCoords } from "./formatting";
import { Link } from "expo-router";

export async function search(query: string, signal: AbortSignal, { lat, lng }: Coords, filters: Filter, appendix: string): Promise<(Volcano | Crater | Deposit)[]> {
    const serverLink = `${Config.SERVER_URL}`;
    const queryUrl = `${serverLink}/search/?lat=${lat}&lng=${lng}&query=${query}&minElevation=${filters.elevation[0]}&maxElevation=${filters.elevation[1]}&minDistance=${filters.distance[0] * 1000}&maxDistance=${filters.distance[1] * 1000}` + appendix;
    try {
        const response = await axios.get(queryUrl, { signal });
        const responseData = response.data;

        const results: (Volcano | Crater | Deposit)[] = [];

        responseData.slice().forEach((obj: any) => {
            if ("lasteruption" in obj){
                results.push({
                        fType: "volcano",
                        id: obj.id,
                        name: obj.volcanoname,
                        type: obj.volcanotype,
                        region: obj.volcanicregion,
                        lastEruption: obj.lasteruption,
                        elevation: obj.volcanoelevation,
                        setting: obj.tectonicsetting,
                        rockType: obj.rocktype,
                        location: { lat: obj.volcanolat, lng: obj.volcanolon},

                        country: obj.volcanocountry
                    })
            }
            else if ("craterdiameter" in obj){
                results.push({
                    fType: "crater",
                    id: obj.craterid,
                    name: obj.cratername,
                    diameter: obj.craterdiameter,
                    age: obj.craterage,
                    location: { lat: obj.craterlat, lng: obj.craterlon },
                    ageCertainty: obj.agecertainty
                })
            }
            else if ("depcommodity" in obj){
                results.push({
                    fType: "deposit",
                    id: obj.depid,
                    name: obj.depname,
                    country: obj.depcountry,
                    type: obj.deptype,
                    location: { lat: obj.deplat, lng: obj.deplon },
                    commodity: obj.depcommodity
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
    type RenderItemProp = {
        item: Volcano | Crater | Deposit
    }

    const RenderItem = ({ item }: RenderItemProp) => {
        return (
            <Link
                href={{
                    pathname: "/[fId]",
                    params: { fId: item.fType + (item.id ?? '').toString() }
                }}
                asChild
            >
                    <Pressable>
                        <View style={styles.result}>
                            <Text>
                                {item.fType.toUpperCase()}: {item.name}
                            </Text>
                            <Text>
                                Location: {formatCoords(item.location.lat, item.location.lng)}
                            </Text>
                        </View>
                    </Pressable>
            </Link>
        )
    }

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
            <FlatList 
                data = {results}
                keyExtractor={(item) => item.fType + (item.id ?? '').toString()}
                renderItem={({ item }) => (
                    <RenderItem item={item} />
                )}
            />
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