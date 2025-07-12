// components/map/hooks/useHandleSelectPlace.ts
import axios from "axios";
import Constants from "expo-constants";
import { Keyboard } from "react-native";
import { Router } from "expo-router";
import { getCoordsFromPlaceId } from "@/services/googleMapsApi";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export async function handleSelectPlace(
  placeId: string,
  description: string,
  setMarker: (coords: any) => void,
  setSuggestions: (s: any[]) => void,
  router: Router
) {
  try {
    const loc = await getCoordsFromPlaceId(placeId);
    if (loc == null) throw new Error("geocode error");
    const coords = { latitude: loc.latitude, longitude: loc.longitude };

    setMarker(coords);
    setSuggestions([]);
    Keyboard.dismiss();

    router.replace({
      pathname: "/",
      params: {
        lat: coords.latitude.toString(),
        lng: coords.longitude.toString(),
        address: encodeURIComponent(description),
      },
    });
  } catch (err) {
    console.error("Geocoding error:", err);
  }
}
