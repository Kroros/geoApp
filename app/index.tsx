import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/pages/home";
import Controles from "@/pages/controles";


const Tab = createBottomTabNavigator();

export default function Index() {
  


  return (
    <Tab.Navigator initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false
      }}
    >
      <Tab.Screen
      name="Home"
      component={Home}
      />

      

      <Tab.Screen
      name="Controles" 
      component={Controles}
      />

    </Tab.Navigator>
  );
}

