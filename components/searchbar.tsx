import React, { useState, useEffect, ReactNode, useRef } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Button,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import { SearchBar } from '@rneui/themed';
import axios from "axios";
import Config from "../app/config";
import Modal from "./modal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CountriesFilters from "./countriesFilters";
import CommoditiesFilters from "./commoditiesFilter";

type Coords = {
  lat: number,
  lng: number
}

type Volcano = {
    fType: string,
    id: number,
    name: string,
    type: string,
    lastEruption: number,
    location: Coords,
    elevation: number
}

type Crater = {
    fType: string,
    id: number,
    name: string,
    diameter: number,
    age: number,
    location: Coords,
    ageCertainty: string
}

type Deposit = {
    fType: string,
    id: number,
    name: string,
    country: string,
    type: string,
    location: Coords,
    commodity: string
}

export default function SearchBarC() {
    const serverLink = `${Config.SERVER_URL}`

    const [ query, setQuery ] = useState<string>("");
    const [ dropDownVis, setDropDownVis ] = useState<boolean>(false);
    const [ dropDown, setDropDown ] = useState<ReactNode>();
    const [ filtersVis, setFiltersVis ] = useState<boolean>(false);
    const [ countriesList, setCountriesList ] = useState<boolean>(false);
    const [ commoditiesList, setCommoditiesList ] = useState<boolean>(false);

    const [ features, setFeatures ] = useState<string[]>(["volcanoes", "impactCraters", "mineralDeposits"])
    const [ countries, setCountries ] = useState<string[]>(Config.DEFAULT_COUNTRY_SELECTION)
    const [ commodities, setCommodities ] = useState<string[]>(Config.DEFAULT_COMMODITY_SELECTION)
    const [ elevation, setElevation ] = useState<number[]>([-6000, 7000])
    const [ diameter, setDiameter ] = useState<number[]>([0, 100])
    const [ distance, setDistance ] = useState<number[]>([0, 20000])

    const abortControllerRef = useRef<AbortController | null>(null);

    let plat: "android" | "ios" | "default" | "undefined";

    useEffect( () => {
        if (query === "") {
            handleDropDownContent("")
            return;
        }

        const delayDebounce = setTimeout(() => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            handleDropDownContent(query, controller.signal);
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [query])

    if (Platform.OS == "android" || Platform.OS == "ios") {
        plat = Platform.OS;
    }
    else {
        plat = "default";
    }



    async function search(query: string, section: string, signal:AbortSignal): Promise<(Volcano | Crater | Deposit)[]>{
        try {
            const response = await axios.get(`${serverLink}/${section}/search?search=${query}`);
            const responseData = response.data

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
                console.log("Request Cancelled");
            } else {
                console.log(error)
            }
            return [];
        }
    }



    async function handleDropDownContent(query: string, signal?: AbortSignal) {
        if (query.startsWith(">volcano:")){
            const results = await search(query.replace(">volcano:", ""), "volcanoes", signal!);
            buildAndSetDropdown(results, ">volcano:");
        }


        else if (query.startsWith(">crater:")){
            const results = await search(query.replace(">crater:", ""), "meteoricCraters", signal!);
            buildAndSetDropdown(results, ">crater:");
        }


        else if (query.startsWith(">mineral_deposit:")){
            const results = await search(query.replace(">mineral_deposit:", ""), "minerals", signal!);
            buildAndSetDropdown(results, ">mineral_deposit:");
        }


        else if (query == "") {
            setDropDown(
            <View style={styles.dropdown}>
                <TouchableWithoutFeedback onPress={() => setQuery(">volcano:")} style={styles.dropDownItem}>
                    <Text style={styles.dropDownItemText}><Text style={styles.dropDownItemTextTag}>&gt;volcano:</Text></Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setQuery(">crater:")} style={styles.dropDownItem}>
                    <Text style={styles.dropDownItemText}><Text style={styles.dropDownItemTextTag}>&gt;crater:</Text></Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setQuery(">mineral_deposit:")} style={styles.dropDownItem}>
                    <Text style={styles.dropDownItemText}><Text style={styles.dropDownItemTextTag}>&gt;mineral_deposit:</Text></Text>
                </TouchableWithoutFeedback>
            </View>)
        }
    }



    function buildAndSetDropdown(results: (Volcano | Crater | Deposit)[], tag: string) {
        const list = results.map((obj) => (
            <TouchableWithoutFeedback key={obj.id}>
                <Text style={styles.dropDownItemText}><Text style={styles.dropDownItemTextTag}>{tag}</Text>{obj.name}</Text>
            </TouchableWithoutFeedback>
        ));

        setDropDown(<ScrollView style={styles.dropdown}>{list}</ScrollView>)
    }

    return (
        <View style={styles.containerStyle}>
            <Button title="Filters" onPress={() => setFiltersVis(true)}></Button>

            <View>
                {(distance[0] != 0 || distance[1] != 20000) && 
                <View>
                    <Button title={`Feature Distance: ${distance[0]} - ${distance[1]}`} onPress={() => setDistance([0, 20000])}/>
                </View>}

                {(diameter[0] != 0 || diameter[1] != 100) && 
                <View>
                    <Button title={`Crater Diameter: ${diameter[0]} - ${diameter[1]}`} onPress={() => setDiameter([0, 100])}/>
                </View>}

                {(elevation[0] != -6000 || elevation[1] != 7000) && 
                <View>
                    <Button title={`Volcano Elevation: ${elevation[0]} - ${elevation[1]}`} onPress={() => setElevation([-6000, 7000])}/>
                </View>}
            </View>

            <SearchBar
                containerStyle={styles.searchBarContainer}
                inputStyle={styles.searchBarInput}
                placeholder="Search"
                onChangeText={(text) => {
                    setQuery(text)
                    setDropDownVis(true)
                }}
                value={query}
                onFocus={() => {
                    setDropDownVis(true)
                }}
                platform={plat}
                onClear={() => {
                    setDropDownVis(false);
                }}
            ></SearchBar>
            <Modal isVisible={filtersVis}>
                <ScrollView contentContainerStyle = {{alignItems: "center"}} style={styles.filtersContainer}>
                    <Button title="Done" onPress={() => setFiltersVis(false)}></Button>
                    <Text style={styles.filtersText}>Minimal Distance:{distance[0]}km</Text>
                    <Text style={styles.textColour}>Maximal Distance:{distance[1]}km</Text>
                    <MultiSlider
                        min = {0}
                        max = {20000}
                        step = {100}
                        isMarkersSeparated = {true}
                        values = {[0, 20000]}
                        onValuesChange={setDistance}
                        touchDimensions={{height: 250,width: 250,borderRadius: 15,slipDisplacement: 200}}
                    ></MultiSlider>

                    <View style={styles.horizontalRule}></View>

                    <Text style={styles.filtersText}>Minimal Crater Diameter:{diameter[0]}km</Text>
                    <Text style={styles.textColour}>Maximal Crater Diameter:{diameter[1]}km</Text>
                    <MultiSlider
                        min = {0}
                        max = {100}
                        step = {1}
                        isMarkersSeparated = {true}
                        values = {[0, 20000]}
                        onValuesChange={setDiameter}
                        touchDimensions={{height: 250,width: 250,borderRadius: 15,slipDisplacement: 200}}
                    ></MultiSlider>

                    <View style={styles.horizontalRule}></View>

                    <Text style={styles.filtersText}>Minimal Volcano Elevation:{elevation[0]}m</Text>
                    <Text style={styles.textColour}>Maximal Volcano Elevation:{elevation[1]}m</Text>
                    <MultiSlider
                        min = {-6000}
                        max = {7000}
                        step = {50}
                        isMarkersSeparated = {true}
                        values = {[-6000, 7000]}
                        onValuesChange={setElevation}
                        touchDimensions={{height: 250,width: 250,borderRadius: 15,slipDisplacement: 200}}
                    ></MultiSlider>

                    <View style={styles.horizontalRule}></View>

                    <Button title="Search in countries:" onPress={() => setCountriesList(!countriesList)}></Button>

                    {countriesList && <CountriesFilters/>}

                    <View style={styles.horizontalRule}></View>

                    <Button title="Commodities of deposits:" onPress={() => setCommoditiesList(!commoditiesList)}></Button>

                    {commoditiesList && <CommoditiesFilters/>}

                    

                    
                </ScrollView>
            </Modal>

            {dropDownVis && dropDown}
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        width: "100%",
        backgroundColor: "white",
    },
    searchBarContainer: {
        backgroundColor: "#505050"
    },
    searchBarInputContainer: {

    },
    searchBarInput: {
        fontFamily: "monospace",
        color: "white",
    },
    dropDownItem: {
        borderColor: "gray",
        borderWidth: 1,
    },
    dropDownItemTextTag: {
        fontFamily: "monospace",
        fontSize: 15,
        color: "gray",
        paddingTop: "3%",
        paddingBottom: "3%",
        borderWidth: 1,
        borderColor: "gray"
    },
    dropDownItemText: {
        fontFamily: "monospace",
        fontSize: 15,
        paddingTop: "3%",
        paddingBottom: "3%",
        borderWidth: 1,
        borderColor: "gray"
    },
    containerStyle: {

    },
    textColour: {
        color: "black"
    },
    filtersContainer: {
        backgroundColor: "white",
        alignContent: "center",
    },
    horizontalRule: {
        width: "95%",
        borderBottomColor:"gray", 
        borderBottomWidth: 1,
        paddingBottom: "2.5%",
    },
    filtersText: {
        color: "black",
        paddingTop: "5%"
    }
})