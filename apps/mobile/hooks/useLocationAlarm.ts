import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { getDistanceInKm } from "@/utils/distance";
import {
  fetchAutocompleteSuggestions,
  geocodeFromTextOrPlaceId,
} from "@/utils/geocode";
import { playAlarmSound, stopAlarmSound } from "@/services/alarmAudio";
import { scheduleNotification } from "@/services/notifications";
import { Alert, Keyboard } from "react-native";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export default function useLocationAlarm() {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [targetCoords, setTargetCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [alarmSet, setAlarmSet] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (Device.isDevice) await Notifications.requestPermissionsAsync();
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (alarmSet && targetCoords && locationPermission) {
      interval = setInterval(async () => {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const distance = getDistanceInKm(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          targetCoords.latitude,
          targetCoords.longitude
        );

        if (distance <= 1.0) {
          triggerAlarm();
          setAlarmSet(false);
          clearInterval(interval);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [alarmSet, targetCoords, locationPermission]);

  const fetchSuggestions = async (text: string) => {
    const results = await fetchAutocompleteSuggestions(text, GOOGLE_API_KEY);
    setSuggestions(results);
  };

  const handleGeocodeSelection = async (text: string, placeId?: string) => {
    try {
      Keyboard.dismiss();
      setSuggestions([]);
      setStatusMessage("Looking up address...");
      const coords = await geocodeFromTextOrPlaceId(
        text,
        placeId,
        GOOGLE_API_KEY
      );
      setTargetCoords(coords);
      setDestination(text);
      setStatusMessage("Target location set.");
    } catch {
      setStatusMessage("Error resolving location.");
    }
  };

  const triggerAlarm = async () => {
    await playAlarmSound();
    Alert.alert("📍 Alarm", "You're near your destination!", [
      {
        text: "Stop Alarm",
        onPress: async () => {
          await stopAlarmSound();
        },
      },
    ]);
    await scheduleNotification();
  };

  return {
    destination,
    setDestination,
    suggestions,
    fetchSuggestions,
    handleGeocodeSelection,
    startAlarm: () => setAlarmSet(true),
    cancelAlarm: () => {
      setAlarmSet(false);
      setStatusMessage("Alarm deactivated.");
    },
    alarmSet,
    statusMessage,
  };
}
