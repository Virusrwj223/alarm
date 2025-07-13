import { View, Text, Button } from "react-native";
import SearchBar from "@/components/searchBar";
import useLocationAlarm from "@/hooks/useLocationAlarm";
import { styles } from "@/style/styles";
import HeaderFilterButton from "@/components/headerFilterButton";

export default function HomeScreen() {
  const { destination, alarmSet, startAlarm, cancelAlarm, statusMessage } =
    useLocationAlarm();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>📍 Location-Based Alarm</Text>
        <HeaderFilterButton />
      </View>

      <SearchBar />

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
