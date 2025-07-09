"use client";

import { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function HomeScreen() {
  const [alarmSet, setAlarmSet] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  // Replace with your destination coordinates
  const TARGET_LOCATION = {
    latitude: 1.3019840588830243, // example: Singapore
    longitude: 103.77347063567062,
  };
  // 1.355314508656988, 103.69341196483923
  // 1.3019840588830243, 103.77347063567062

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (Device.isDevice) {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (alarmSet && locationPermission) {
      interval = setInterval(async () => {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const distance = getDistanceInKm(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          TARGET_LOCATION.latitude,
          TARGET_LOCATION.longitude
        );

        console.log("Distance to target:", distance.toFixed(2), "km");

        if (distance <= 1.0) {
          triggerAlarm();
          setAlarmSet(false);
          clearInterval(interval);
        }
      }, 5000); // check every 5 seconds
    }

    return () => clearInterval(interval);
  }, [alarmSet, locationPermission]);

  const triggerAlarm = async () => {
    Alert.alert("📍 Alarm", "You're near your destination!");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📍 Alarm",
        body: "You have arrived within 1km of your target!",
      },
      trigger: null,
    });
  };

  // Haversine formula to calculate distance between two lat/lng points
  const getDistanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number) => (value * Math.PI) / 180;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Location Alarm</Text>

      <Button
        title="Start Location Alarm"
        onPress={() => setAlarmSet(true)}
        disabled={alarmSet}
      />

      {alarmSet && (
        <Text style={{ marginTop: 20 }}>
          Alarm is active. Tracking location...
        </Text>
      )}
    </View>
  );
}
