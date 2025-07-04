import React, { useState, useEffect, ReactNode } from "react";
import {
    View,
    Button,
    TextInput,
    StyleSheet,
    Modal,
    ViewStyle,
    TextStyle,
    TouchableWithoutFeedback
} from "react-native";
import SearchDropDown from "./searchDropDown";
import SearchDropDownOption from "./searchDropdownOption";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Props {
    onFocus: () => void,
    containerStyle: ViewStyle,
    inputContainerStyle: ViewStyle,
    inputStyle: TextStyle,
    onChangeText: (text: string) => void,
    value: string,
    onClear: () => void
}

export default function SearchBar({
    onFocus,
    containerStyle,
    inputContainerStyle,
    inputStyle,
    onChangeText,
    value,
    onClear
}: Props) {
    return (
        <View style={containerStyle}>
            <TextInput
                style={inputStyle}
                placeholder="Search"
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
            ></TextInput>
        </View>
    );
}

