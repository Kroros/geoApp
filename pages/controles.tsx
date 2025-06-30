import {
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  SafeAreaView,
  Button,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { RouteProp } from '@react-navigation/native';

function formatCoords(lat: number, lng: number){
    let coords: string[] = ["", ""];
    let latSec: number = Math.round(lat * 3600);
    let lngSec: number = Math.round(lng * 3600);

    let latMin: number = ( ( latSec % 3600 ) - ((latSec % 3600) % 60) ) / 60;
    let lngMin: number = ( ( lngSec % 3600 ) - ((lngSec % 3600) % 60) ) / 60;

    let latDeg: number = ( latSec - ( latSec % 3600 ) ) / 3600;
    let lngDeg: number = ( lngSec - ( lngSec % 3600 ) ) / 3600;

    latSec = ( ( latSec % 3600 ) % 60 );
    lngSec = lngSec = ( ( lngSec % 3600 ) % 60 );

    coords[0] = (lat >= 0) ? `${latDeg}° ${latMin}' ${latSec}" N` : `${-latDeg}° ${-latMin}' ${-latSec}" S`;

    coords[1] = (lng >= 0) ? `${lngDeg}° ${lngMin}' ${lngSec}" E` : `${-lngDeg}° ${-lngMin}' ${-lngSec}" W`;

    return coords;
}

export default function Controles() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function getCurrentLocation() {
          let { status } = await Location.requestBackgroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            console.error(errorMsg)
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }
    
        getCurrentLocation();
      }, [location]);
    
      let latitude = Number(JSON.stringify(location?.coords.latitude));
      let longitude = Number(JSON.stringify(location?.coords.longitude));
      let altitude = Math.round(Number(JSON.stringify(location?.coords.altitude)));

      

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.texts}>
                Current Location: {"\n"} {formatCoords(latitude, longitude)[0]}, {formatCoords(latitude, longitude)[1]} {"\n"}
            </Text>
            <Text style={styles.texts}>
                Current Altitude: {"\n"} {altitude}m
            </Text>
            <Button
                title="What is my location?"
                onPress={() => console.log(formatCoords(-18.104087, -63.931540)[0], formatCoords(-18.104087, -63.931540)[1])}
            />
            
            <Button
                title="What is my altitude?"
                onPress={() => console.log(`${altitude}`)}
            />
        </SafeAreaView>
    );
}

const  styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222222",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    texts: {
        color: "#FFFFFF",
    }
})