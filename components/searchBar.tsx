import {formatCoords} from "@/extensions/formatting";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Searchbar } from "react-native-paper";
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
import type { Coords, Crater, Deposit, Filter, Volcano } from "../types/types";
import Modal from "./modal";
import Config from "../app/config";
import CheckBoxFilters from "./checkBoxFilters";
import FiltersMenu from "./filtersList";

export default function SearchBarC({ lat, lng }: Coords) {
    const countriesList: string[] = Config.DEFAULT_COUNTRY_SELECTION;
    const featuresList: string[] = Config.DEFAULT_FEATURE_SELECTION;
    const commoditiesList: string[] = Config.DEFAULT_COMMODITY_SELECTION;

    const [ query, setQuery ] = useState<string>("");
    const [ dropDownVis, setDropDownVis ] = useState<boolean>(false);
    const [ dropDown, setDropDown ] = useState<ReactNode>();
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

    useArrayFilters("geoFeature", Array.from(features), setFeaturesLinkAppendix);

    useArrayFilters("countries", Array.from(countries), setCountriesLinkAppendix);

    useArrayFilters("commodities", Array.from(commodities), setCommoditiesLinkAppendix);

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
        /* const results = await useSearchLogic(query.toLowerCase(), signal!, { lat, lng }, filters, featuresLinkAppendix + countriesLinkAppendix + commoditiesLinkAppendix);
        buildAndSetDropdown(results) */
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
            

            <FiltersMenu 
                features={features}
                setFeatures={setFeatures}
                countries={countries}
                setCountries={setCountries}
                commodities={commodities}
                setCommodities={setCommodities}
                elevation={elevation}
                setElevation={setElevation}
                diameter={diameter}
                setDiameter={setDiameter}
                distance={distance}
                setDistance={setDistance}
            />

        </View>
    )
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