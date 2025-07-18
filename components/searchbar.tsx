import {formatCoords} from "@/extensions/formatting";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { SearchBar } from '@rneui/themed';
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
    Button,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import useArrayFilters from "../hooks/useArrayFilters";
import useSearchLogic from "../hooks/useSearchLogic";
import type { Coords, Crater, Deposit, Filter, Volcano } from "../types/types";
import CommoditiesFilters from "./commoditiesFilter";
import CountriesFilters from "./countriesFilters";
import FeaturesFilter from "./featureFilter";
import Modal from "./modal";

export default function SearchBarC({ lat, lng }: Coords) {
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

    const filters: Filter = {
        features: features,
        countries: countries,
        commodities: commodities,
        elevation: elevation,
        diameter: diameter,
        distance: distance
    }

    const [ featuresLinkAppendix, setFeaturesLinkAppendix ] = useState<string>("");
    const [ countriesLinkAppendix, setCountriesLinkAppendix ] = useState<string>("");
    const [ commoditiesLinkAppendix, setCommoditiesLinkAppendix ] = useState<string>("");

    const abortControllerRef = useRef<AbortController | null>(null);

    useArrayFilters("geoFeature", features, setFeaturesLinkAppendix);

    useArrayFilters("countries", countries, setCountriesLinkAppendix);

    useArrayFilters("commodities", commodities, setCommoditiesLinkAppendix);

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

    async function handleDropDownContent(query: string, signal?: AbortSignal) {
        const results = await useSearchLogic(query.toLowerCase(), signal!, { lat, lng }, filters, featuresLinkAppendix + countriesLinkAppendix + commoditiesLinkAppendix);
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