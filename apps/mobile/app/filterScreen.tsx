// File: app/filter.tsx
import { useState } from "react";
import { View, Text, Button } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useRadiusStore } from "@/stores/radiusStore";
import { filterScreenStyles } from "@/style/filterScreenTabStyles";
import Colors from "@/style/Colors";

export default function FilterScreen() {
  const router = useRouter();
  const { radius, setRadius } = useRadiusStore();
  const [value, setValue] = useState(radius);

  return (
    <View style={filterScreenStyles.container}>
      <Text style={filterScreenStyles.label}>Set Alarm Radius</Text>
      <Text style={filterScreenStyles.valueText}>{value} m</Text>

      <Slider
        style={filterScreenStyles.slider}
        minimumValue={200}
        maximumValue={1000}
        step={50}
        minimumTrackTintColor={Colors.light.tint}
        maximumTrackTintColor="#ddd"
        thumbTintColor="#fff"
        onValueChange={(v: number) => setValue(Math.round(v))}
        value={value}
      />

      <View style={filterScreenStyles.rangeLabels}>
        <Text style={filterScreenStyles.rangeText}>200m</Text>
        <Text style={filterScreenStyles.rangeText}>1km</Text>
      </View>

      <View style={filterScreenStyles.buttonWrapper}>
        <Button
          title="Apply"
          color={Colors.light.tint}
          onPress={() => {
            setRadius(value);
            router.back();
          }}
        />
      </View>
    </View>
  );
}
