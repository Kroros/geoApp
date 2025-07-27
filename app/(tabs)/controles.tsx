import {formatCoords, craterAge, volcanoActivity} from "@/extensions/formatting";
import { getNearestCrater, getNearestDeposit, getNearestVolcano } from "@/extensions/getNearestFeature";
import { gcDistance } from "@/extensions/calculations";
import React, { useState } from "react";
import {
    Button,
    KeyboardAvoidingView,
    StyleSheet,
    SafeAreaView
} from "react-native";
import Modal from "../../components/modal";
import { Text, View } from '@/components/Themed';
import type { Crater, Deposit, Volcano } from "../../types/types";
import useLocation from "@/hooks/useLocation";
import SearchBarC from "@/components/searchBar";

export default function Controles() {

  const [ nearestVolc, setNearestVolc ] = useState<Volcano>({
        fType: "volcano",
        id: 0,
        name: "",
        type: "",
        lastEruption: 0,
        location: {lat: 0, lng: 0},
        elevation: 0,
        country: ""
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

    const br = "\n"; 

    const [ volcModalVisible, setVolcModalVisibility ] = useState<boolean>(false);
    const [ craterModVis, setCraterModVis ] = useState<boolean>(false);
    const [ depModVis, setDepModVis ] = useState<boolean>(false);

    const [latitude, longitude, altitude, errorMsg] = useLocation();

    let text = "Finding Location...";
    if (errorMsg) {
        text = errorMsg.toString();
    } else if (latitude && longitude) {
        text = `Current Location: ${br} ${formatCoords(latitude, longitude)}`;
    }

    return (
        (latitude && longitude) && altitude ?
        (<SafeAreaView style={styles.safeArea}>
        <View style={[styles.container]}>
            <Text style={styles.texts}>
                {text}
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

            <KeyboardAvoidingView style={{width: "100%"}}>
                <SearchBarC lat={latitude} lng={longitude}/>
            </KeyboardAvoidingView>
        </View>


        <Modal isVisible={volcModalVisible} children={
            <View style={styles.popup}>
                <Text style={styles.texts}>
                    The nearest volcano to your location is {nearestVolc.name} {br}{br}
                    Volcano Location: {formatCoords(nearestVolc.location.lat, nearestVolc.location.lng)} ({nearestVolc.country}) {br}{br}
                    Distance from current location:
                    {gcDistance({lat: latitude, lng: longitude}, {lat: nearestVolc.location.lat, lng: nearestVolc.location.lng})/1000}km {br}{br}
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
                    {gcDistance({lat: latitude, lng: longitude}, {lat: nearestCrater.location.lat, lng: nearestCrater.location.lng})/1000}km {br}{br}
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
                    {gcDistance({lat: latitude, lng: longitude}, {lat: nearestDeposit.location.lat, lng: nearestDeposit.location.lng})/1000}km {br}{br}
                    Deposit Type: {nearestDeposit.type} {br}{br}
                    Commodoties found at deposit: {nearestDeposit.commodity} {br}
                </Text>
                <Button title="Close" onPress={() => setDepModVis(!depModVis)}/>
            </View>
            
            }>   
        </Modal>

        </SafeAreaView>) : (
            <Text>Finding Location...</Text>
        )
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        marginTop: "-55%",
        backgroundColor: 'black',
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        maxHeight: 1500
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
    texts: {
        color: "#FFFFFF",
        width: "50%",
        textAlign: "center"
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
