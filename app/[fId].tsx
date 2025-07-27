import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect } from "react";
import { View, Text } from "react-native"

export default function FeatureInfoScreen() {
    const { fId } = useLocalSearchParams();

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: fId
        });
    })

    return (
        <View>
            <Text style={{color: "white"}}>
                Hiiii {fId}
            </Text>
        </View>
    )
}