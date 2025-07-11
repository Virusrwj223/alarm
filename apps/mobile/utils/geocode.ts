import axios from "axios";
import * as Location from "expo-location";

export async function fetchAutocompleteSuggestions(query: string, key: string) {
  if (!query) return [];
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
    {
      params: {
        input: query,
        key,
        components: "country:sg",
        radius: 50000,
      },
    }
  );
  return res.data.predictions.map((p: any) => ({
    description: p.description,
    place_id: p.place_id,
  }));
}

export async function geocodeFromTextOrPlaceId(
  text: string,
  placeId: string | undefined,
  key: string
) {
  if (placeId) {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          place_id: placeId,
          key,
        },
      }
    );
    const loc = res.data.results[0].geometry.location;
    return { latitude: loc.lat, longitude: loc.lng };
  } else {
    const res = await Location.geocodeAsync(text);
    const loc = res[0];
    return { latitude: loc.latitude, longitude: loc.longitude };
  }
}
