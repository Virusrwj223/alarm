import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, LatLng, MapPressEvent } from "react-native-maps";
import { useRouter } from "expo-router";
import { mapTabStyles } from "@/style/mapTabStyles";
import useCurrentLocation from "@/hooks/map/useCurrentLocation";
import { handleMapPress } from "@/hooks/map/useHandleMapPress";
import { handleSelectPlace } from "@/hooks/map/useHandleSelectPlace";
import { fetchSuggestions } from "@/services/googleMapsApi";

export default function MapScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const mapRef = useRef<MapView>(null);

  // Custom hook to set initial region
  useCurrentLocation(setRegion);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        onPress={(e: MapPressEvent) =>
          handleMapPress(e, setMarker, setSuggestions, router)
        }
        showsUserLocation
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <View style={mapTabStyles.searchContainer}>
        <TextInput
          style={mapTabStyles.input}
          placeholder="Search location / Map select"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            fetchSuggestions(text, setSuggestions);
          }}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />

        {suggestions.length > 0 && (
          <View style={mapTabStyles.suggestionBox}>
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.place_id}
                style={mapTabStyles.suggestionItem}
                onPress={() =>
                  handleSelectPlace(
                    item.place_id,
                    item.description,
                    setMarker,
                    setSuggestions,
                    router
                  )
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
