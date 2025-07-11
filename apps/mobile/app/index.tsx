import { View, Text, Button } from "react-native";
import SearchBar from "@/components/searchBar";
import useLocationAlarm from "@/hooks/useLocationAlarm";
import { styles } from "@/style/styles";

export default function HomeScreen() {
  const {
    destination,
    setDestination,
    suggestions,
    fetchSuggestions,
    handleGeocodeSelection,
    startAlarm,
    cancelAlarm,
    alarmSet,
    statusMessage,
  } = useLocationAlarm();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📍 Location-Based Alarm</Text>

      <SearchBar
        value={destination}
        onChange={(text) => {
          setDestination(text);
          fetchSuggestions(text);
        }}
        suggestions={suggestions}
        onSelect={handleGeocodeSelection}
        onSubmit={() => handleGeocodeSelection(destination)}
      />

      <View style={styles.buttonGroup}>
        <Button
          title="Start Alarm"
          onPress={startAlarm}
          disabled={alarmSet || !destination}
        />
        {alarmSet && (
          <Button
            title="Deactivate Alarm"
            onPress={cancelAlarm}
            color="tomato"
          />
        )}
      </View>

      {alarmSet && <Text>Tracking location...</Text>}
      {statusMessage !== "" && <Text>{statusMessage}</Text>}
    </View>
  );
}
