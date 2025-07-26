import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import useArrayFilters from "../hooks/useArrayFilters";
import Modal from "./modal";
import Config from "../app/config";
import CheckBoxFilters from "./checkBoxFilters";
import {
    Button,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Filter } from "@/types/types";

interface Props {
    features: string[],
    setFeatures: React.Dispatch<React.SetStateAction<string[]>>;
    countries: string[],
    setCountries: React.Dispatch<React.SetStateAction<string[]>>;
    commodities: string[],
    setCommodities: React.Dispatch<React.SetStateAction<string[]>>;
    elevation: number[],
    setElevation: React.Dispatch<React.SetStateAction<number[]>>;
    diameter: number[],
    setDiameter: React.Dispatch<React.SetStateAction<number[]>>;
    distance: number[],
    setDistance: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function FiltersMenu({ features, setFeatures, countries, setCountries, commodities, setCommodities, elevation, setElevation, diameter, setDiameter, distance, setDistance }: Props) {
    const countriesList: string[] = Config.DEFAULT_COUNTRY_SELECTION;
    const featuresList: string[] = Config.DEFAULT_FEATURE_SELECTION;
    const commoditiesList: string[] = Config.DEFAULT_COMMODITY_SELECTION;

    const [ countriesListVisible, setCountriesListVis ] = useState<boolean>(false);
    const [ commoditiesListVisible, setCommoditiesListVis ] = useState<boolean>(false);
    const [ filtersVis, setFiltersVis ] = useState<boolean>(false);

    return(
        <View>
            <Button title="Filters" onPress={() => setFiltersVis(true)}></Button>
            
            <View>
                {(distance[0] != 0 || distance[1] != 20000) ? 
                <View>
                    <Button title={`Feature Distance: ${distance[0]} - ${distance[1]}`} onPress={() => setDistance([0, 20000])}/>
                </View>: null}

                {(diameter[0] != 0 || diameter[1] != 100) ? 
                <View>
                    <Button title={`Crater Diameter: ${diameter[0]} - ${diameter[1]}`} onPress={() => setDiameter([0, 100])}/>
                </View> : null}

                {(elevation[0] != -6000 || elevation[1] != 7000) ? 
                <View>
                    <Button title={`Volcano Elevation: ${elevation[0]} - ${elevation[1]}`} onPress={() => setElevation([-6000, 7000])}/>
                </View> : null}

                {(countries.length !== 0) ? 
                <View>
                    <Button title={`Selected Countries: ${countries}`} onPress={() => setCountries([])}/>
                </View> : null}

                {(commodities.length !== 0) ? 
                <View>
                    <Button title={`Selected Commodities: ${commodities}`} onPress={() => setCommodities([])}/>
                </View> : null}

                {(features.length !== 0) ? 
                <View>
                    <Button title={`Selected Features: ${commodities}`} onPress={() => setFeatures([])}/>
                </View> : null}
            </View>

            <Modal isVisible={filtersVis}>
                <ScrollView style={styles.filtersContainer} contentContainerStyle={{alignItems: "center"}}>
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
                        values = {[0, 7000]}
                        onValuesChange={setElevation}
                        touchDimensions={{height: 250,width: 250,borderRadius: 15,slipDisplacement: 200}}
                    ></MultiSlider>

                    <View style={styles.horizontalRule}></View>

                    <CheckBoxFilters items={featuresList} selectedItems={features} setSelectedItems={setFeatures}/>

                    <Button title="Search in countries:" onPress={() => setCountriesListVis(!countriesListVisible)}></Button>

                    {countriesListVisible ? <CheckBoxFilters items={countriesList} selectedItems={countries} setSelectedItems={setCountries}/> : null}

                    <View style={styles.horizontalRule}></View>

                    <Button title="Commodities of deposits:" onPress={() => setCommoditiesListVis(!commoditiesListVisible)}></Button>

                    {commoditiesListVisible ? <CheckBoxFilters items={commoditiesList} selectedItems={commodities} setSelectedItems={setCommodities}/> : null}         
                </ScrollView>
            </Modal>
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
        width: "100%"
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