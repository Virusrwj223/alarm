import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function HeaderFilterButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/filterScreen")}
      style={{ padding: 8 }}
    >
      <FontAwesome name="sliders" size={22} color="black" />
    </Pressable>
  );
}
