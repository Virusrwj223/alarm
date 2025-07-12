// components/map/hooks/useHandleMapPress.ts
import { Keyboard } from "react-native";
import axios from "axios";
import { MapPressEvent } from "react-native-maps";
import Constants from "expo-constants";
import { Router } from "expo-router";
import { getAddressFromCoords } from "@/services/googleMapsApi";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export async function handleMapPress(
  e: MapPressEvent,
  setMarker: (coords: any) => void,
  setSuggestions: (s: any[]) => void,
  router: Router
) {
  const coords = e.nativeEvent.coordinate;
  setMarker(coords);
  setSuggestions([]);
  Keyboard.dismiss();

  try {
    const address = await getAddressFromCoords(coords);
    if (address == null) throw new Error("reverse geocode failed");
    router.replace({
      pathname: "/",
      params: {
        lat: coords.latitude.toString(),
        lng: coords.longitude.toString(),
        address: encodeURIComponent(address),
      },
    });
  } catch (error) {
    console.error("Reverse geocoding failed", error);
  }
}
