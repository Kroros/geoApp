import React, { useState, useEffect, ReactNode, useRef } from "react";
import {
    StyleSheet,
    View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface Props {
    selectedFeatures: string[];
    setSelectedFeatures:React.Dispatch<React.SetStateAction<string[]>>;
}

const features: string[] = ["volcanoes", "impactCraters", "mineralDeposits"];

export default function FeaturesFilter({ selectedFeatures, setSelectedFeatures }: Props){
    const toggleFeature = (feature: string) => {
        setSelectedFeatures(prev => {
            if (prev.includes(feature)) {
                return prev.filter(f => f !== feature)
            } else {
                return [...prev, feature]
            }
        })
    }

    const list = features.map((feature) => (
        <BouncyCheckbox
            key={feature}
            text={feature}
            textStyle={styles.textStyle}
            iconStyle={styles.checkBox}
            innerIconStyle={styles.checkBox}
            onPress={() => {
                toggleFeature(feature)
            }}
            />
    ));

    return (
            <View style={{width: "100%"}}>
                {list}
            </View>
        );
}

const styles = StyleSheet.create({
    textStyle: {
        textDecorationLine: "none",
    },
    checkBox: {
        borderRadius: 0
    }
})