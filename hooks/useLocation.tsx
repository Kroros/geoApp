import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

export default function useLocation() {
    const [ location, setLocation ] = useState<Location.LocationObject | null>(null);
    const [ errorMsg, setErrorMsg ] = useState<string | null>(null);


    useEffect(() => {
        let subscriber: Location.LocationSubscription | null = null;

        async function watchLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission denied")
                setErrorMsg("Permission to access location was denied");
                return;
            }

            subscriber = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                (newLocation) => {
                    setLocation(newLocation)
                }
            );
        }

        watchLocation();

        return () => {
            if(subscriber) {
                subscriber.remove();
            }
        }
    }, [])

    const latitude = location?.coords.latitude ?? null;
    const longitude = location?.coords.longitude ?? null;
    const altitude = (location !== null) && (location?.coords.altitude !== null) ? 
        Math.round(location.coords.altitude) :
        null;

    const loc: [number | null, number | null, number | null, string | null] = [latitude, longitude, altitude, errorMsg]
    return loc;
}