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

interface Crater {
    id: number
    name: string,
    diameter: number,
    age: number,
    location: Coords,
    ageCertainty: string
}

interface Deposit {
    name: string,
    country: string,
    type: string,
    location: Coords,
    commodity: string
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

function craterAge(id: number, age: number, certainty: string){
    if (id >= 281){
        if (certainty == "exact"){
            return `${age} million years old`
        }
        else if (certainty == "around"){
            return `Around ${age} million years old`
        }
        else if (certainty == "less"){
            return `Less than ${age} million years old`
        }
    }
    else if (id < 281){
        if (certainty == "exact"){
            return `${age} thousand years old`
        }
        else if (certainty == "around"){
            return `Around ${age} thousand years old`
        }
        else if (certainty == "less"){
            return `Less than ${age} thousand years old`
        }
    }
}

function gcDistance(p1: Coords, p2: Coords){
    const r = 6371000;

    const lat1 = p1.lat * Math.PI / 180;
    const lat2 = p2.lat * Math.PI / 180;
    const lng1 = p1.lng * Math.PI / 180;
    const lng2 = p2.lng * Math.PI / 180;

    const dLng = lng1 - lng2;

    const a = Math.pow(Math.cos(lat2) * Math.sin(dLng), 2) +
                Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng), 2);
    const b = Math.sqrt(a);
    const c = Math.sin(lat1) * Math.sin(lat2) +
                   Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const dSigma = Math.atan2(b, c);

    return Math.round(r * dSigma);
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

    const [nearestCrater, setNearestCrater] = useState<Crater>({
        id: 0,
        name: "",
        diameter: 0,
        age: 0,
        location: {lat: 0, lng: 0},
        ageCertainty: ""
    });

    const [nearestDeposit, setNearestDeposit] = useState<Deposit>({
        name: "",
        country: "",
        type: "",
        location: {lat: 0, lng: 0},
        commodity: ""
    });

    

    const [volcModalVisible, setVolcModalVisibility] = useState(false);
    const [craterModVis, setCraterModVis] = useState(false);
    const [depModVis, setDepModVis] = useState(false);

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
    const craterLink = `${Config.SERVER_URL}/meteoricCraters/nearest?lat=${latitude}&lon=${longitude}`
    const depositLink = `${Config.SERVER_URL}/minerals/nearest?lat=${latitude}&lon=${longitude}`

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

    function getNearestCrater() {
        axios
            .get(craterLink)
            .then((response) => {
                const responseData = response.data;

                setNearestCrater({
                    id: responseData.craterId,
                    name: responseData.craterName,
                    diameter: responseData.craterDiameter,
                    age: responseData.craterAge,
                    location: { lat: responseData.craterLat, lng: responseData.craterLon },
                    ageCertainty: responseData.ageCertainty
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function getNearestDeposit() {
        axios
            .get(depositLink)
            .then((response) => {
                const responseData = response.data;

                setNearestDeposit({
                    name: responseData.depName,
                    country: responseData.depCountry,
                    type: responseData.depType,
                    location: { lat: responseData.depLat, lng: responseData.depLon },
                    commodity: responseData.depCommodity
                });
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return(
        <SafeAreaView style={styles.container}>

            {(latitude && longitude) && altitude ? (
                <View>
                    <Text style={styles.texts}>
                        Current Location: {br} {formatCoords(latitude, longitude)} {br}
                    </Text>
                    <Text style={styles.texts}>
                        Current Altitude: {br} {altitude}m {br}
                    </Text>
                </View>
            ) : <ActivityIndicator size="large"/>}

            
            <Button
                title="Where is the nearest volcano?"
                onPress={() => {
                getNearestVolcano();
                setVolcModalVisibility(!volcModalVisible);
                }}
            />
            
            <Button
                title="Where is the nearest meteoric crater?"
                onPress={() => {
                    getNearestCrater();
                    setCraterModVis(!craterModVis);
                }}
            />
            <Button
                title="Where is the nearest mineral deposit?"
                onPress={() => {
                    getNearestDeposit();
                    setDepModVis(!depModVis);
                }}
            />

            <Modal isVisible={volcModalVisible} children={
                <View style={styles.popup}>
                    <Text style={styles.texts}>
                        The nearest volcano to your location is {nearestVolc.name} {br}{br}
                        Volcano Location: {formatCoords(nearestVolc.location.lat, nearestVolc.location.lng)} {br}{br}
                        Distance from current location:
                        {gcDistance({lat: latitude, lng: longitude}, {lat: nearestVolc.location.lat, lng: nearestVolc.location.lng})}m {br}{br}
                        Volcano Type: {nearestVolc.type} {br}{br}
                        Volcano Activity: {volcanoActivity(nearestVolc.lastEruption)} {br}{br}
                        Volcano maximum elevation: {nearestVolc.elevation} {br}
                    </Text>
                    <Button title="Close" onPress={() => setVolcModalVisibility(!volcModalVisible)}/>
                </View>
                
                }>   
            </Modal>

            <Modal isVisible={craterModVis} children={
                <View>
                    <Text style={styles.texts}>
                        The nearest meteoric crater to your location is {nearestCrater.name} {br}{br}
                        Crater Location: {formatCoords(nearestCrater.location.lat, nearestCrater.location.lng)} {br}{br}
                        Distance from current location:
                        {gcDistance({lat: latitude, lng: longitude}, {lat: nearestCrater.location.lat, lng: nearestCrater.location.lng})}m {br}{br}
                        Crater Diameter: {nearestCrater.diameter}km {br}{br}
                        Crater Age: {craterAge(nearestCrater.id, nearestCrater.age, nearestCrater.ageCertainty)} {br}
                    </Text>
                    <Button title="Close" onPress={() => setCraterModVis(!craterModVis)}/>
                </View>
                
                }>   
            </Modal>

            <Modal isVisible={depModVis} children={
                <View>
                    <Text style={styles.texts}>
                        The nearest known mineral deposit to your location is {nearestDeposit.name} {br}{br}
                        Deposit Location: {formatCoords(nearestDeposit.location.lat, nearestDeposit.location.lng)} ({nearestDeposit.country}) {br}{br}
                        Distance from current location:
                        {gcDistance({lat: latitude, lng: longitude}, {lat: nearestDeposit.location.lat, lng: nearestDeposit.location.lng})}m {br}{br}
                        Deposit Type: {nearestDeposit.type} {br}{br}
                        Commodoties found at deposit: {nearestDeposit.commodity} {br}
                    </Text>
                    <Button title="Close" onPress={() => setDepModVis(!depModVis)}/>
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
    },
    popup: {
        width: "90%",
        marginLeft: "5%",
        borderWidth: 2,
    }
})