import {
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { RouteProp } from '@react-navigation/native';

interface Data {
    location: Location.LocationObject
}

export default function Controles() {
    return(
        <Text>Hello World</Text>
    );
}