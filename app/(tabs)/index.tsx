import {
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import Map from "../../components/Map";

export default function TabOneScreen() {
    return (
      <SafeAreaView style={styles.container}>
            <Map></Map>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
        title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
        separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
