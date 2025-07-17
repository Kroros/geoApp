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
import FeaturesFilter from "./featureFilter";

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

function formatCoords(lat: number, lng: number){
    let coords: string[] = ["", ""];
    let latSec: number = Math.round(lat * 3600);
    let lngSec: number = Math.round(lng * 3600);

    let latMin: number = ( ( latSec % 3600 ) - ((latSec % 3600) % 60) ) / 60;
    let lngMin: number = ( ( lngSec % 3600 ) - ((lngSec % 3600) % 60) ) / 60;

    let latDeg: number = ( latSec - ( latSec % 3600 ) ) / 3600;
    let lngDeg: number = ( lngSec - ( lngSec % 3600 ) ) / 3600;

    latSec = ( ( latSec % 3600 ) % 60 );
    lngSec = lngSec = ( ( lngSec % 3600 ) % 60 );

    coords[0] = (lat >= 0) ? `${latDeg}° ${latMin}' ${latSec}" N` : `${-latDeg}° ${-latMin}' ${-latSec}" S`;

    coords[1] = (lng >= 0) ? `${lngDeg}° ${lngMin}' ${lngSec}" E` : `${-lngDeg}° ${-lngMin}' ${-lngSec}" W`;

    return `${coords[0]},    ${coords[1]}`;
}

export default function SearchBarC({ lat, lng }: Coords) {
    const serverLink = `${Config.SERVER_URL}`

    const [ query, setQuery ] = useState<string>("");
    const [ dropDownVis, setDropDownVis ] = useState<boolean>(false);
    const [ dropDown, setDropDown ] = useState<ReactNode>();
    const [ filtersVis, setFiltersVis ] = useState<boolean>(false);
    const [ countriesListVisible, setCountriesList ] = useState<boolean>(false);
    const [ commoditiesListVisible, setCommoditiesList ] = useState<boolean>(false);

    const [ features, setFeatures ] = useState<string[]>([])
    const [ countries, setCountries ] = useState<string[]>([])
    const [ commodities, setCommodities ] = useState<string[]>([])
    const [ elevation, setElevation ] = useState<number[]>([-6000, 7000])
    const [ diameter, setDiameter ] = useState<number[]>([0, 100])
    const [ distance, setDistance ] = useState<number[]>([0, 20000])


    const [ featuresLinkAppendix, setFeaturesLinkAppendix ] = useState<string>("");
    const [ countriesLinkAppendix, setCountriesLinkAppendix ] = useState<string>("");
    const [ commoditiesLinkAppendix, setCommoditiesLinkAppendix ] = useState<string>("");

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect( () => {
        let queryAppendix: string = ``;

        features.forEach(f => {
            queryAppendix += `&geoFeature=${f}`;
        });

        setFeaturesLinkAppendix(queryAppendix);
    }, [features]);

    useEffect( () => {
        let queryAppendix: string = ``;

        countries.forEach(c => {
            queryAppendix += `&countries=${c}`;
        });

        setCountriesLinkAppendix(queryAppendix);
    }, [countries]);

    useEffect( () => {
        let queryAppendix: string = ``;

        commodities.forEach(c => {
            queryAppendix += `&commodities=${c}`;
        });

        setCommoditiesLinkAppendix(queryAppendix);
    }, [commodities]);

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

    let plat: "android" | "ios" | "default" | "undefined";

    if (Platform.OS == "android" || Platform.OS == "ios") {
        plat = Platform.OS;
    }
    else {
        plat = "default";
    }

    async function search(query: string, signal: AbortSignal): Promise<(Volcano | Crater | Deposit)[]>{
        try {
            const response = await axios.get(`${serverLink}/search/?lat=${lat}&lng=${lng}&query=${query}&minElevation=${elevation[0]}&maxElevation=${elevation[1]}&minDistance=${distance[0] * 1000}&maxDistance=${distance[1] * 1000}` + featuresLinkAppendix + countriesLinkAppendix + commoditiesLinkAppendix, { signal });
            const responseData = response.data;

            console.log(`${serverLink}/search/?lat=${lat}&lng=${lng}&query=${query}&minElevation=${elevation[0]}&maxElevation=${elevation[1]}&minDistance=${distance[0] * 1000}&maxDistance=${distance[1] * 1000}` + featuresLinkAppendix + countriesLinkAppendix + commoditiesLinkAppendix);
            console.log(responseData);

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

    async function handleDropDownContent(query: string, signal?: AbortSignal) {
        const results = await search(query.toLowerCase(), signal!);
        buildAndSetDropdown(results)
    }

    function buildAndSetDropdown(results: (Volcano | Crater | Deposit)[]) {
        let list: ReactNode[] = [];

        results.forEach(obj => {
            if (obj.fType) {
                list.push((
                    <TouchableWithoutFeedback onPress={() => console.log(`Pressed on ${obj.name}`)}>
                        <View>
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

                {(countries.length != 0) && 
                <View>
                    <Button title={`Selected Countries: ${countries}`} onPress={() => setCountries([])}/>
                </View>}

                {(commodities.length != 0) && 
                <View>
                    <Button title={`Selected Commodities: ${commodities}`} onPress={() => setCommodities([])}/>
                </View>}
            </View>

            <SearchBar
                containerStyle={styles.searchBarContainer}
                inputStyle={styles.searchBarInput}
                placeholder="Search"
                onChangeText={(text) => {
                    setQuery(text);
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

                    <FeaturesFilter selectedFeatures={features} setSelectedFeatures={setFeatures}/>

                    <Button title="Search in countries:" onPress={() => setCountriesList(!countriesListVisible)}></Button>

                    {countriesListVisible && <CountriesFilters selectedCountries={countries} setSelectedCountries={setCountries}/>}

                    <View style={styles.horizontalRule}></View>

                    <Button title="Commodities of deposits:" onPress={() => setCommoditiesList(!commoditiesListVisible)}></Button>

                    {commoditiesListVisible && <CommoditiesFilters selectedCommodities={commodities} setSelectedCommodities={setCommodities}/>}

                    

                    
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
    },
    textStyle: {
        textDecorationLine: "none",
    },
    checkBox: {
        borderRadius: 0
    }
})