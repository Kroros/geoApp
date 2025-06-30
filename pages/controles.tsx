import {
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  SafeAreaView,
  Button,
  ActivityIndicator,
  View
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { RouteProp } from '@react-navigation/native';
import Config from "../app/config";
import Modal from "../components/modal";
import axios from "axios";

interface Coords {
  lat: number,
  lng: number
}

interface Volcano {
    name: string,
    type: string,
    lastEruption: number,
    location: Coords,
    elevation: number
}

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

    return `${coords[0]},    ${coords[1]}`;
}

export default function Controles() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [nearestVolc, setNearestVolc] = useState<Volcano>({
        name: "",
        type: "",
        lastEruption: 0,
        location: {lat: 0, lng: 0},
        elevation: 0
    });

    function volcanoActivity(lastErup: number){
        if (lastErup == -32768){
            return "Active during the holocene, last eruption unknown";
        }
        else if (lastErup == -2147483647){
            return "Inactive";
        }
        else{
            if (lastErup < 0){
                return `Active, last eruption in ${-lastErup}BCE`
            }
            else {
                return `Active, last eruption ${lastErup}CE`
            }
        }
    }

    const [volcModalVisible, setVolcModalVisibility] = useState(false);

    const br = "\n"; 

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

    const volcanoLink = `${Config.SERVER_URL}/volcanoes/nearest?lat=${latitude}&lon=${longitude}`

    function getNearestVolcano() {
        axios
            .get(volcanoLink)
            .then((response) => {
                const responseData = response.data;

                setNearestVolc({
                    name: responseData.volcanoName,
                    type: responseData.volcanoType,
                    lastEruption: responseData.lastEruption,
                    location: { lat: responseData.volcanoLat, lng: responseData.volcanoLon },
                    elevation: responseData.volcanoElevation
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.texts}>
                Current Location: {"\n"} {formatCoords(latitude, longitude)} {"\n"}
            </Text>
            <Text style={styles.texts}>
                Current Altitude: {"\n"} {altitude}m
            </Text>
            <Button
                title="Where is the nearest volcano?"
                onPress={() => {
                getNearestVolcano();
                setVolcModalVisibility(!volcModalVisible);
                }}
            />
            
            <Button
                title="Where is the nearest meteoric crater?"
                onPress={() => console.log(`${altitude}`)}
            />
            <Button
                title="Link?"
                onPress={() => console.log(`${Config.SERVER_URL}`)}
            />

            <Modal isVisible={volcModalVisible} children={
                <View>
                    <Text style={styles.texts}>
                        The nearest volcano to your location is {nearestVolc.name} {br}{br}
                        Volcano Location: {formatCoords(nearestVolc.location.lat, nearestVolc.location.lng)} {br}{br}
                        Volcano Type: {nearestVolc.type} {br}{br}
                        Volcano Activity: {volcanoActivity(nearestVolc.lastEruption)} {br}{br}
                        Volcano maximum elevation: {nearestVolc.elevation} {br}
                    </Text>
                    <Button title="Close" onPress={() => setVolcModalVisibility(!volcModalVisible)}></Button>
                </View>
                
                }>   
            </Modal>
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