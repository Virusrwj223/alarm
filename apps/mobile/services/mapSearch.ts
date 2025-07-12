// File: services/mapSearch.ts
import axios from "axios";
import Constants from "expo-constants";
import { LatLng } from "react-native-maps";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export async function getSuggestions(query: string) {
  if (!query) return [];
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input: query,
          key: GOOGLE_API_KEY,
          components: "country:sg",
        },
      }
    );
    return res.data.predictions;
  } catch (err) {
    console.error("Autocomplete error:", err);
    return [];
  }
}

export async function getAddressFromCoords(coords: LatLng) {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${coords.latitude},${coords.longitude}`,
          key: GOOGLE_API_KEY,
        },
      }
    );
    return res.data.results[0]?.formatted_address || "Pinned Location";
  } catch (err) {
    console.error("Reverse geocoding failed", err);
    return null;
  }
}

export async function getCoordsFromPlaceId(placeId: string) {
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
    return { latitude: loc.lat, longitude: loc.lng };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}
