import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "@/pages/home";
import Map from "../components/map";
import Controles from "@/pages/controles";


const Stack = createNativeStackNavigator();

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
  let altitude = Number(JSON.stringify(location?.coords.altitude));


  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
      name="Home"
      component={Home}
      />

      

      <Stack.Screen
      name="Controles" 
      >
        {props => <Controles/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

