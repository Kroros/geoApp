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
import { search, buildAndSetDropdown } from "@/extensions/searchLogic";

export default function SearchBarC({ lat, lng }: Coords) {
    const [ query, setQuery ] = useState<string>("");
    const [ dropDownVis, setDropDownVis ] = useState<boolean>(false);
    const [ dropDown, setDropDown ] = useState<ReactNode>();

    const [ features, setFeatures ] = useState<Set<string>>(new Set())
    const [ countries, setCountries ] = useState<Set<string>>(new Set())
    const [ commodities, setCommodities ] = useState<Set<string>>(new Set())
    const [ elevation, setElevation ] = useState<number[]>([-6000, 7000])
    const [ diameter, setDiameter ] = useState<number[]>([0, 100])
    const [ distance, setDistance ] = useState<number[]>([0, 20000])

    const [ featuresLinkAppendix, setFeaturesLinkAppendix ] = useState<string>("");
    const [ countriesLinkAppendix, setCountriesLinkAppendix ] = useState<string>("");
    const [ commoditiesLinkAppendix, setCommoditiesLinkAppendix ] = useState<string>("");

    const abortControllerRef = useRef<AbortController | null>(null);

    const filters: Filter = {
        features: Array.from(features),
        countries: Array.from(countries),
        commodities: Array.from(commodities),
        elevation: elevation,
        diameter: diameter,
        distance: distance
    }

    useArrayFilters("geoFeature", Array.from(features), setFeaturesLinkAppendix);

    useArrayFilters("countries", Array.from(countries), setCountriesLinkAppendix);

    useArrayFilters("commodities", Array.from(commodities), setCommoditiesLinkAppendix);

    async function handleDropDownContent(query: string, setter: React.Dispatch<React.SetStateAction<ReactNode>>, signal?: AbortSignal) {
        const results = await search(query.toLowerCase(), signal!, { lat, lng }, filters, featuresLinkAppendix + countriesLinkAppendix + commoditiesLinkAppendix);
        buildAndSetDropdown(results, setter)
    }

    useEffect( () => {
        if (query === "") {
            handleDropDownContent("", setDropDown)
            return;
        }

        const delayDebounce = setTimeout(() => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            handleDropDownContent(query, setDropDown, controller.signal);
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

            <Searchbar
                value={query}
                placeholder="Search"
                onChangeText={(text) => {
                    setQuery(text)
                    setDropDownVis(true)
                }}
                onFocus={() => {
                    setDropDownVis(true)
                }}
                onClearIconPress={() => {
                    setDropDownVis(false)
                }}
            />

            {dropDownVis && dropDown}

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
        width: "75%",
        height: "25%",
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