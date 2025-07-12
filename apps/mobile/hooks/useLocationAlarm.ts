import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import { requestAppPermissions } from "@/services/permissions";
import { startLocationAlarm } from "@/services/alarmAudio";
import {
  fetchAutocompleteSuggestions,
  geocodeFromTextOrPlaceId,
} from "@/utils/geocode";

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

  const { lat, lng, address } = useLocalSearchParams();

  useEffect(() => {
    requestAppPermissions().then(setLocationPermission);
  }, []);

  useEffect(() => {
    if (!lat || !lng) return;

    const parsedLat = parseFloat(lat as string);
    const parsedLng = parseFloat(lng as string);

    const newCoords = { latitude: parsedLat, longitude: parsedLng };

    setTargetCoords(newCoords);
    setDestination(
      decodeURIComponent((address as string) ?? `${parsedLat}, ${parsedLng}`)
    );
    setStatusMessage("Target location set.");
  }, [lat, lng, address]);

  useEffect(() => {
    let interval: any;

    if (alarmSet && targetCoords && locationPermission) {
      interval = startLocationAlarm(targetCoords, () => setAlarmSet(false));
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

  return {
    destination,
    setDestination,
    suggestions,
    fetchSuggestions,
    handleGeocodeSelection,
    startAlarm: () => {
      if (targetCoords) {
        setAlarmSet(true);
        setStatusMessage("Alarm started. Tracking location...");
      } else {
        setStatusMessage("Set a location first.");
      }
    },
    cancelAlarm: () => {
      setAlarmSet(false);
      setStatusMessage("Alarm deactivated.");
    },
    alarmSet,
    statusMessage,
  };
}
