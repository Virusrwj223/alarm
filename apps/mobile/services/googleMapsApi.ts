import axios from "axios";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";
import Constants from "expo-constants";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export async function fetchAutocompleteSuggestions(
  query: string
): Promise<{ description: string; place_id: string }[]> {
  if (!query) return [];

  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: query,
          key: GOOGLE_API_KEY,
          components: "country:sg",
          radius: 50000,
        },
      }
    );

    return res.data.predictions;
  } catch (err) {
    console.error("Autocomplete error:", err);
    return [];
  }
}

export const fetchSuggestions = async (
  query: string,
  setSuggestions: (results: any[]) => void
) => {
  if (!query) return;
  try {
    const res = await fetchAutocompleteSuggestions(query);
    setSuggestions(res);
  } catch (err) {
    console.error("Autocomplete error:", err);
  }
};

export async function getAddressFromCoords(
  coords: LatLng
): Promise<string | null> {
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

export async function getCoordsFromPlaceId(
  placeId: string
): Promise<LatLng | null> {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
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

export async function geocodeFromTextOrPlaceId(
  text: string,
  placeId?: string
): Promise<LatLng | null> {
  if (placeId) {
    return await getCoordsFromPlaceId(placeId);
  }

  try {
    const res = await Location.geocodeAsync(text);
    const loc = res[0];
    return { latitude: loc.latitude, longitude: loc.longitude };
  } catch (err) {
    console.error("GeocodeAsync error:", err);
    return null;
  }
}
