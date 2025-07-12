// File: components/map/MapSuggestion.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { mapTabStyles } from "@/style/mapTabStyles";

export function MapSuggestion({ suggestions, onSelect }: any) {
  return (
    <View style={mapTabStyles.suggestionBox}>
      {suggestions.map((item: any) => (
        <TouchableOpacity
          key={item.place_id}
          style={mapTabStyles.suggestionItem}
          onPress={() => onSelect(item.place_id, item.description)}
        >
          <Text>{item.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
