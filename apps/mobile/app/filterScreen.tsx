// File: app/filter.tsx
import { useState } from "react";
import { View, Text, Button } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useRadiusStore } from "@/stores/radiusStore";

export default function FilterScreen() {
  const router = useRouter();
  const { radius, setRadius } = useRadiusStore();
  const [value, setValue] = useState(radius);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Set Alarm Radius (meters):</Text>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
        {value}
      </Text>

      <Slider
        minimumValue={200}
        maximumValue={10000}
        step={50}
        value={value}
        onValueChange={(v: number) => setValue(Math.round(v))}
      />

      <Button
        title="Apply"
        onPress={() => {
          setRadius(value);
          router.back(); // Go back to HomeScreen
        }}
      />
    </View>
  );
}
