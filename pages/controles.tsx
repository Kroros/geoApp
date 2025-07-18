import SearchBarC from "@/components/searchbar";
import {formatCoords, craterAge, volcanoActivity} from "@/extensions/formatting";
import { getNearestCrater, getNearestDeposit, getNearestVolcano } from "@/extensions/getNearestFeature";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
    Button,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import Config from "../app/config";
import Modal from "../components/modal";
import type { Coords, Crater, Deposit, Volcano } from "../types/types";

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
    const [ location, setLocation ] = useState<Location.LocationObject | null>(null);
    const [ errorMsg, setErrorMsg ] = useState<string | null>(null);

    const [ nearestVolc, setNearestVolc ] = useState<Volcano>({
        fType: "volcano",
        id: 0,
        name: "",
        type: "",
        lastEruption: 0,
        location: {lat: 0, lng: 0},
        elevation: 0
    });

    const [ nearestCrater, setNearestCrater ] = useState<Crater>({
        fType: "crater",
        id: 0,
        name: "",
        diameter: 0,
        age: 0,
        location: {lat: 0, lng: 0},
        ageCertainty: ""
    });

    const [ nearestDeposit, setNearestDeposit ] = useState<Deposit>({
        fType: "deposit",
        id: 0,
        name: "",
        country: "",
        type: "",
        location: {lat: 0, lng: 0},
        commodity: ""
    });

    const [ searchQuery, setSearchQuery ] = useState<string>("")
    const [ searchVis, setSearchVis ] = useState<boolean>(false);

    const [ volcModalVisible, setVolcModalVisibility ] = useState<boolean>(false);
    const [ craterModVis, setCraterModVis ] = useState<boolean>(false);
    const [ depModVis, setDepModVis ] = useState<boolean>(false);

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

/*     function getNearestVolcano() {
        axios
            .get(volcanoLink)
            .then((response) => {
                const responseData = response.data;

                setNearestVolc({
                    fType: "volcano",
                    id: responseData.volcanoId,
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
                    fType: "crater",
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
                    fType: "deposit",
                    id: responseData.depId,
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
    } */

    return(
        <ScrollView style={styles.container}>
            {(latitude && longitude) && altitude ? (
                <View>
                    <Text style={styles.texts}>
                        Current Location: {br} {formatCoords(latitude, longitude)} {br}
                    </Text>
                    <Text style={styles.texts}>
                        Current Altitude: {br} {altitude}m {br}
                    </Text>
                    <Button
                        title="Where is the nearest volcano?"
                        onPress={() => {
                        getNearestVolcano(latitude, longitude, setNearestVolc);
                        setVolcModalVisibility(!volcModalVisible);
                        }}
                    />
                    
                    <Button
                        title="Where is the nearest meteoric crater?"
                        onPress={() => {
                            getNearestCrater(latitude, longitude, setNearestCrater);
                            setCraterModVis(!craterModVis);
                        }}
                    />
                    <Button
                        title="Where is the nearest mineral deposit?"
                        onPress={() => {
                            getNearestDeposit(latitude, longitude, setNearestDeposit);
                            setDepModVis(!depModVis);
                        }}
                    />
                </View>
            ) : <Text>Finding Location...</Text>}

            <SearchBarC 
                lat={latitude}
                lng={longitude}
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
        </ScrollView>
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
    },
    searchBar: {
        backgroundColor: "#FFF",
    },
})