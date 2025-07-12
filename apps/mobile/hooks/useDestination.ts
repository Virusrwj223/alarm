// hooks/useDestination.ts
import { useState } from "react";
import { Keyboard } from "react-native";
import Constants from "expo-constants";
import {
  fetchAutocompleteSuggestions,
  geocodeFromTextOrPlaceId,
} from "@/utils/geocode";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export default function useDestination() {
  const [destination, setDestination] = useState("");
  const [targetCoords, setTargetCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

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
    targetCoords,
    suggestions,
    fetchSuggestions,
    handleGeocodeSelection,
    setTargetCoords,
    setStatusMessage,
    statusMessage,
  };
}
