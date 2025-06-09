import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import Map from "../components/map";
import { RouteProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";



export default function Home({ location, navigation }: any) {
    let latitude = Number(JSON.stringify(location?.coords.latitude));
    let longitude = Number(JSON.stringify(location?.coords.longitude));

    return (
        <SafeAreaView style={styles.container}>
            { latitude && longitude ? (
                <Map lat={latitude} lng = {longitude} />
            ) : <ActivityIndicator size="large"/> }
            <Button 
                title="Go to other page"
                onPress={() => navigation.navigate("Controles")}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  texts: {
    color: "#FFFFFF",
  }
});