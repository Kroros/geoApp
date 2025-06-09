import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Text, StyleSheet, View } from "react-native";
import * as Location from 'expo-location';
import React, { Component, useState, useEffect } from "react";

interface Location {
    lat: number;
    lng: number;
}

export default function Map({ lat, lng }: Location) {
  return (
        <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            >
            <Marker
                coordinate={{
                latitude: 52,
                longitude: 5,
                }}
            />
        </MapView>
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
