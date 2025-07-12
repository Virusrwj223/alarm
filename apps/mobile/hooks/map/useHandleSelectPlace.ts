// components/map/hooks/useHandleSelectPlace.ts
import axios from "axios";
import Constants from "expo-constants";
import { Keyboard } from "react-native";
import { Router } from "expo-router";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export async function handleSelectPlace(
  placeId: string,
  description: string,
  setMarker: (coords: any) => void,
  setSuggestions: (s: any[]) => void,
  router: Router
) {
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          place_id: placeId,
          key: GOOGLE_API_KEY,
        },
      }
    );

    const loc = res.data.results[0].geometry.location;
    const coords = { latitude: loc.lat, longitude: loc.lng };

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
