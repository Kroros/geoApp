import { StyleSheet, Alert, ActivityIndicator, Button, View, Platform, StatusBar, } from "react-native";
import * as Location from 'expo-location';
import React, { useState, useEffect } from "react";
import { Asset } from "expo-asset";
import { LatLng, LeafletView } from "react-native-leaflet-view";
import * as FileSystem from "expo-file-system";
import volcanoMarkersJson from "../assets/data/volcanoMarkers.json" with { type: 'json' };
import craterMarkersJson from "../assets/data/craterMarkers.json" with { type: 'json' };
import depositMarkersJson from "../assets/data/mineralMarkers.json" with { type: 'json' };

export default function Map() {
  const [ volcanoMarkers, setVolcanoMarkers ] = useState<any[]>([]);
  const [ volcanoMarkerVisible, setVolcanoMarkerVisibilty ] = useState<boolean>(true);

  const [ craterMarkers, setCraterMarkers ] = useState<any[]>([]);
  const [ craterMarkerVisible, setCraterMarkerVisibilty ] = useState<boolean>(true);

  const [ depositMarkers, setDepositMarkers ] = useState<any[]>([]);
  const [ depositMarkerVisible, setDepositMarkerVisibility ] = useState<boolean>(true);

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
    setVolcanoMarkers(volcanoMarkersJson);
    setCraterMarkers(craterMarkersJson);
    setDepositMarkers(depositMarkersJson);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    /* const newMarkers = [];

    if (volcanoMarkerVisible){
      newMarkers.push([...volcanoMarkers]);
    }
    if (craterMarkerVisible){
      newMarkers.push([...craterMarkers]);
    }
    if (depositMarkerVisible){
      newMarkers.push([...depositMarkers]);
    }

    setMarkers(newMarkers); */

   /*  if (volcanoMarkerVisible){
      setMarkers(volcanoMarkers);
    } */
    
    setMarkers([...volcanoMarkers, ...craterMarkers, ...depositMarkers])
  }, [volcanoMarkerVisible, craterMarkerVisible, depositMarkerVisible]);

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

        <Button
        title="💎"
        color="#eeeeee"
        onPress={() => setDepositMarkerVisibility(!depositMarkerVisible)}/>
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
