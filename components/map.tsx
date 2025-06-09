import { StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import React, { useState, useEffect } from "react";
import { Asset } from "expo-asset";
import { LatLng, LeafletView } from "react-native-leaflet-view";
import * as FileSystem from "expo-file-system";

interface Location {
    lat: number;
    lng: number;
}

const someCoords: LatLng = {
  lat: 52,
  lng: 5
}

export default function Map({ lat, lng }: Location) {
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

    return () => {
      isMounted = false;
    };
  }, []);

  if (!webViewContent) {
    return <ActivityIndicator size="large" />
  }

  return (
       
      <LeafletView
        source={{ html: webViewContent }}
        mapCenterPosition={{
          lat: lat,
          lng: lng
        }}
        doDebug={false}
        mapMarkers={[
          {
            position: someCoords,
            icon: '📍',
            size: [32, 32],
          }
        ]}
      />
    );
}

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: "0%",
    left: "0%",
    right: 0,
    bottom: 0,
  },
});
