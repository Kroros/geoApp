import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

export default function Compass() {
  const [heading, setHeading] = useState(0);
  const rotateValue = new Animated.Value(0);

  useEffect(() => {
    const subscribe = async () => {

      Location.watchHeadingAsync((heading) => {
        setHeading(heading.trueHeading);

        Animated.timing(rotateValue, {
          toValue: heading.trueHeading,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    };

    subscribe();
  }, []);

  const rotateStyle = {
    transform: [{ rotate: `${-heading}deg` }],
  };

  return (
    <View>
      <View>
        <Animated.Image
          source={require("../assets/images/kompas.png")}
          style={[rotateStyle]}
        />
      </View>
      <Text
        style={{
          color: "white",
        }}
        numberOfLines={3}
      >
        {heading.toFixed(2)}
      </Text>
    </View>
  );
}
