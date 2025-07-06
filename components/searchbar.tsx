import React, { useState, useEffect, ReactNode, use } from "react";
import {
    View,
    ScrollView,
    Text,
    Button,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableWithoutFeedback,
    Platform
} from "react-native";
import { SearchBar } from '@rneui/themed';
import axios from "axios";
import Config from "../app/config";

type Coords = {
  lat: number,
  lng: number
}

type Volcano = {
    id: number,
    name: string,
    type: string,
    lastEruption: number,
    location: Coords,
    elevation: number
}

type Crater = {
    id: number,
    name: string,
    diameter: number,
    age: number,
    location: Coords,
    ageCertainty: string
}

type Deposit = {
    id: number,
    name: string,
    country: string,
    type: string,
    location: Coords,
    commodity: string
}

interface Props {
    containerStyle: ViewStyle,
    inputContainerStyle: ViewStyle,
    inputStyle: TextStyle,
    onClear: () => void
}

export default function SearchBarC({
    containerStyle,
    inputContainerStyle,
    inputStyle,
    onClear
}: Props) {
    const serverLink = `${Config.SERVER_URL}`

    const [ query, setQuery ] = useState<string>("");

    const [ dropDownVis, setDropDownVis ] = useState<boolean>(false);

    const [ searchResults, setSearchResults ] = useState<(Volcano | Crater | Deposit)[]>([]);

    let plat: "android" | "ios" | "default" | "undefined";

    if (Platform.OS == "android" || Platform.OS == "ios") {
        plat = Platform.OS;
    }
    else {
        plat = "default";
    }

    function search(query: string, section: string){
        axios
            .get(`${serverLink}/${section}/search?search=${query}`)
            .then((response) => {
                const responseData = response.data;

                const results: (Volcano | Crater | Deposit)[] = [];

                responseData.slice().forEach((obj: any) => {
                    results.push({
                        id: obj.id,
                        name: obj.volcanoName,
                        type: obj.volcanoType,
                        lastEruption: obj.lastEruption,
                        location: { lat: obj.volcanoLat, lng: obj.volcanoLon},
                        elevation: obj.volcanoElevation
                    })
                })

                setSearchResults(results);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleDropDownContent() {
        if (dropDownVis) {
            if (query.startsWith(">volcano:")){
                search(query.replace(">volcano:", ""), "volcanoes")
                const list: ReactNode[] = [];

                searchResults.slice().forEach((obj: Volcano | Crater | Deposit) => {
                    list.push(
                        <TouchableWithoutFeedback key={obj.id}>
                            <Text style={styles.dropDownItemText}>{obj.name}</Text>
                        </TouchableWithoutFeedback>
                    )
                })

                return <ScrollView>{list}</ScrollView>;
            }
            else if (query.startsWith(">crater:")){

            }
            else if (query.startsWith(">mineral_deposit:")){
                
            }
            else if (query == "") {
                return (<View>
                    <TouchableWithoutFeedback onPress={() => setQuery(">volcano:")}><Text style={styles.dropDownItemText}>&gt;volcano:</Text></TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setQuery(">crater:")}><Text style={styles.dropDownItemText}>&gt;crater:</Text></TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setQuery(">mineral_deposit:")}><Text style={styles.dropDownItemText}>&gt;mineral_deposit:</Text></TouchableWithoutFeedback>
                </View>)
            }
        }
    }

    return (
        <View style={containerStyle}>
            <SearchBar
                containerStyle={styles.searchBar}
                placeholder="Search"
                onChangeText={(text) => {
                    setQuery(text)
                    setDropDownVis(true)
                }}
                value={query}
                onFocus={() => setDropDownVis(true)}
                platform={plat}
                onKeyboardHide={() => {
                    setDropDownVis(false);
                }}
            ></SearchBar>

            {handleDropDownContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        width: "100%",
        backgroundColor: "grey",
    },
    searchBar: {
        
    },
    dropDownItem: {

    },
    dropDownItemText: {
        fontFamily: "monospace",
        fontSize: 15,
    },
})