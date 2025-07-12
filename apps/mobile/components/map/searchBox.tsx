// File: components/map/SearchBox.tsx
import React from "react";
import { View, TextInput, Keyboard } from "react-native";
import { mapTabStyles } from "@/style/mapTabStyles";

export default function SearchBox({
  search,
  setSearch,
  onFetchSuggestions,
  fetchSuggestions,
}: any) {
  return (
    <View style={mapTabStyles.searchContainer}>
      <TextInput
        style={mapTabStyles.input}
        placeholder="Search location / Map select"
        value={search}
        onChangeText={async (text) => {
          setSearch(text);
          const suggestions = await fetchSuggestions(text);
          onFetchSuggestions(suggestions);
        }}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
      />
    </View>
  );
}
