import axios from "axios";
import Constants from "expo-constants";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export const fetchSuggestions = async (
  query: string,
  setSuggestions: (results: any[]) => void
) => {
  if (!query) return;
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
    setSuggestions(res.data.predictions);
  } catch (err) {
    console.error("Autocomplete error:", err);
  }
};
