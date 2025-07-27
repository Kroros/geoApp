import { Searchbar } from "react-native-paper";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    View,
} from "react-native";
import useArrayFilters from "../hooks/useArrayFilters";
import type { Coords, Filter} from "../types/types";
import FiltersMenu from "./filtersList";
import { search, buildAndSetDropdown } from "@/extensions/searchLogic";

export default function SearchBarC({ lat, lng }: Coords) {
    const [ query, setQuery ] = useState<string>("");
    const [ dropDownVis, setDropDownVis ] = useState<boolean>(false);
    const [ dropDown, setDropDown ] = useState<ReactNode>();

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

    const filters: Filter = {
        features: features,
        countries: countries,
        commodities: commodities,
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
                style={{width: "100%"}}
            />

            {dropDownVis && dropDown}
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        width: "100%",
        height: "25%",
    },
})