import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { styles } from "./styles";

type Suggestion = { description: string; place_id: string };

export default function SearchBar({
  value,
  onChange,
  onSelect,
  suggestions,
  onSubmit,
}: {
  value: string;
  onChange: (text: string) => void;
  onSelect: (desc: string, placeId: string) => void;
  suggestions: Suggestion[];
  onSubmit: () => void;
}) {
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={value}
          onChangeText={onChange}
        />
        <Pressable onPress={onSubmit} style={styles.icon}>
          <FontAwesome name="search" size={20} color="#333" />
        </Pressable>
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          style={styles.dropdown}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => onSelect(item.description, item.place_id)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
}
