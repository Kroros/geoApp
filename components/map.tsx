import { StyleSheet, Alert, ActivityIndicator, Button, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Asset } from "expo-asset";
import { LeafletView, MapMarker } from "react-native-leaflet-view";
import MapView, { UrlTile, PROVIDER_DEFAULT } from "react-native-maps";
import * as FileSystem from "expo-file-system";
import volcanoMarkersJson from "../assets/data/volcanoMarkers.json" with { type: 'json' };
import craterMarkersJson from "../assets/data/craterMarkers.json" with { type: 'json' };
import depositMarkersJson from "../assets/data/mineralMarkers.json" with { type: 'json' };

export default function Map() {
  const [ volcanoMarkers, setVolcanoMarkers ] = useState<MapMarker[]>([]);
  const [ volcanoMarkerVisible, setVolcanoMarkerVisibilty ] = useState<boolean>(false);

  const [ craterMarkers, setCraterMarkers ] = useState<MapMarker[]>([]);
  const [ craterMarkerVisible, setCraterMarkerVisibilty ] = useState<boolean>(false);

  const [ depositMarkers, setDepositMarkers ] = useState<MapMarker[]>([]);
  const [ depositMarkerVisible, setDepositMarkerVisibility ] = useState<boolean>(false);

  const [ markers, setMarkers ] = useState<MapMarker[]>([]);

  const [ webViewContent, setWebViewContent ] = useState<string | null>(null);
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
    let newMarkers: any[] = [];

    if (volcanoMarkerVisible) {
      newMarkers = [...newMarkers, ...volcanoMarkers]
    }
    if (craterMarkerVisible) {
      newMarkers = [...newMarkers, ...craterMarkers]
    }
    if (depositMarkerVisible) {
      newMarkers = [...newMarkers, ...depositMarkers]
    }

    setMarkers(newMarkers);
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

        {/* <MapView
        
        >
            <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapView> */}


        <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(255,255,255,0.7)', padding: 2 }}>
            © OpenStreetMap contributors
        </Text>

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
