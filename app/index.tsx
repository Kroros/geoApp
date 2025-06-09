import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator
} from "react-native";
import React, { Component, useState, useEffect } from "react";
import { Magnetometer } from "expo-sensors";
import * as Location from "expo-location";
import Compass from "../components/compass";
import Map from "../components/map";

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, [location]);

  let latitude = Number(JSON.stringify(location?.coords.latitude));
  let longitude = Number(JSON.stringify(location?.coords.longitude));
  let altitude = Number(JSON.stringify(location?.coords.altitude));

  return (
    <SafeAreaView style={styles.container}>
      {latitude && longitude ? <Map lat={latitude} lng = {longitude} /> : <ActivityIndicator/>}
      <Text>Current Altitude: {altitude}</Text>
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
