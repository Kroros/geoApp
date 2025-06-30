import axios from "axios";
import { StyleSheet, Alert, ActivityIndicator, Button, View, Platform, StatusBar, } from "react-native";
import * as Location from 'expo-location';
import React, { useState, useEffect } from "react";
import { Asset } from "expo-asset";
import { LatLng, LeafletView } from "react-native-leaflet-view";
import * as FileSystem from "expo-file-system";
import Config from "../app/config";

interface Location {
    lat: number;
    lng: number;
}


export default function Map({ lat, lng }: Location) {
  const volcanoesLink = `${Config.SERVER_URL}/volcanoes`;
  const cratersLink = `${Config.SERVER_URL}/meteoricCraters/`;

  const [ volcanoCoords, setVolcanoCoords ] = useState<LatLng[]>([]);
  const [ volcanoMarkers, setVolcanoMarkers ] = useState<any[]>([]);
  const [ volcanoMarkerVisible, setVolcanoMarkerVisibilty ] = useState<boolean>(true);

  const [ craterCoords, setCraterCoords ] = useState<LatLng[]>([]);
  const [ craterMarkers, setCraterMarkers ] = useState<any[]>([]);
  const [ craterMarkerVisible, setCraterMarkerVisibilty ] = useState<boolean>(true);

  const [ markers, setMarkers ] = useState<any[]>([]);

  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    const loadHtml = async () => {
      try {
        const path = require("../assets/leaflet.html");
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!);

        if (isMounted) {
          setWebViewContent(htmlContent)
        }
      } catch (error) {
        Alert.alert("Error loading HTML", JSON.stringify(error));
        console.error("Error loading HTML", error);
      }
    };

    loadHtml();
    getVolcanoes();
    getCraters();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (volcanoMarkerVisible && craterMarkerVisible){
      setMarkers([...volcanoMarkers, ...craterMarkers])
    }
    else if (volcanoMarkerVisible && !craterMarkerVisible){
      setMarkers(volcanoMarkers)
    }
    else if (!volcanoMarkerVisible && craterMarkerVisible){
      setMarkers(craterMarkers)
    }
    else {
      setMarkers([])
    }

  }, [volcanoMarkerVisible, craterMarkerVisible]);

  function getVolcanoes() {
    axios
      .get(volcanoesLink)
      .then((response) => {
        const responseData = response.data;

        const newCoords: LatLng[] = [];
        const newMarkers: any[] = [];

        responseData.slice().forEach((coord: any) => {
          newCoords.push({
            lat: coord.volcanolat,
            lng: coord.volcanoLon
          });
          newMarkers.push({
            position: { lat: coord.volcanoLat, lng: coord.volcanoLon },
            icon: "🌋",
            size: [32,32]
          });
        });

        setVolcanoCoords(newCoords);
        setVolcanoMarkers(newMarkers);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getCraters() {
    axios
      .get(cratersLink)
      .then((response) => {
        const responseData = response.data;

        const newCoords: LatLng[] = [];
        const newMarkers: any[] = [];

        responseData.slice().forEach((coord: any) => {
          newCoords.push({
            lat: coord.craterLat,
            lng: coord.craterLon
          });
          newMarkers.push({
            position: { lat: coord.craterLat, lng: coord.craterLon },
            icon: "☄️",
            size: [32,32]
          });
        });

        setCraterCoords(newCoords);
        setCraterMarkers(newMarkers);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (!webViewContent) {
    return <ActivityIndicator size="large" />
  }

  return (
    <View style={styles.container}>
      <LeafletView
        source={{ html: webViewContent }}
        doDebug={false}
        mapMarkers={markers}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="🌋"
          color="#eeeeee"
          onPress={() => setVolcanoMarkerVisibilty(!volcanoMarkerVisible)}/>
          <Button
          title="☄️"
          color="#eeeeee"
          onPress={() => setCraterMarkerVisibilty(!craterMarkerVisible)}/>
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: "3%",
  },
  buttonContainer: {
    width: "15%",
    marginLeft: "85%",
  }
});
