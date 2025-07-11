import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, LatLng, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

export default function MapScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };
    getCurrentLocation();
  }, []);

  const handleMapPress = async (e: MapPressEvent) => {
    const coords = e.nativeEvent.coordinate;
    setMarker(coords);
    setSuggestions([]);
    Keyboard.dismiss();

    // Get address from coordinates
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

      const address =
        res.data.results[0]?.formatted_address || "Pinned Location";

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
  };

  const fetchSuggestions = async (query: string) => {
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

  const handleSelectPlace = async (placeId: string, description: string) => {
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
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        onPress={handleMapPress}
        showsUserLocation
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search location / Map select"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            fetchSuggestions(text);
          }}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />

        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.place_id}
                style={styles.suggestionItem}
                onPress={() =>
                  handleSelectPlace(item.place_id, item.description)
                }
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 50,
    width: width - 30,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4,
    padding: 10,
    zIndex: 2,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  suggestionBox: {
    marginTop: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
