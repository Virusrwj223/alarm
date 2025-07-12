// File: components/SearchBar.tsx
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { searchBarStyles } from "@/style/components/searchBarStyles";

export default function SearchBar() {
  const router = useRouter();
  const { address } = useLocalSearchParams();
  const [text, setText] = useState("");

  useEffect(() => {
    if (address && typeof address === "string") {
      setText(decodeURIComponent(address));
    }
  }, [address]);

  const handlePress = () => {
    router.push("/map");
  };

  return (
    <Pressable onPress={handlePress} style={searchBarStyles.searchContainer}>
      <View style={searchBarStyles.inner}>
        <FontAwesome
          name="search"
          size={18}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={searchBarStyles.input}
          placeholder="Set destination location"
          value={text}
          editable={false} // Prevent editing directly
          pointerEvents="none" // Allow Pressable to handle taps
        />
      </View>
    </Pressable>
  );
}
