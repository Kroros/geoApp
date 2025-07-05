import React, { useState, useEffect, ReactNode } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableWithoutFeedback,
    Platform
} from "react-native";
import { SearchBar } from '@rneui/themed';

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
    const [ query, setQuery ] = useState<string>("");

    const [ dropDownVis, setDropDownVis ] = useState<boolean>(false)

    let plat: "android" | "ios" | "default" | "undefined";

    if (Platform.OS == "android" || Platform.OS == "ios") {
        plat = Platform.OS;
    }
    else {
        plat = "default";
    }

    function search(query: string){

    }

    function handleDropDownContent() {
        if (dropDownVis) {
            if (query.startsWith(">volcano:")){

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