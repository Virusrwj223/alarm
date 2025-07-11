// File: components/SearchBar.tsx
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";

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
    <Pressable onPress={handlePress} style={styles.searchContainer}>
      <View style={styles.inner}>
        <FontAwesome
          name="search"
          size={18}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Set destination location"
          value={text}
          editable={false} // Prevent editing directly
          pointerEvents="none" // Allow Pressable to handle taps
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
