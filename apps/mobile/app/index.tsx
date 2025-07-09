import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
  Alert,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import { Audio } from "expo-av";
import Constants from "expo-constants";

// Replace with your actual key
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;
let alarmSound: Audio.Sound | null = null;

export default function HomeScreen() {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [targetCoords, setTargetCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [alarmSet, setAlarmSet] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (Device.isDevice) {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (alarmSet && targetCoords && locationPermission) {
      interval = setInterval(async () => {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const distance = getDistanceInKm(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          targetCoords.latitude,
          targetCoords.longitude
        );

        console.log("Distance to target:", distance.toFixed(2), "km");

        if (distance <= 1.0) {
          triggerAlarm();
          setAlarmSet(false);
          clearInterval(interval);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [alarmSet, targetCoords, locationPermission]);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: GOOGLE_API_KEY,
            radius: 50000,
            components: "country:sg",
          },
        }
      );

      const predictions = res.data.predictions.map((prediction: any) => ({
        description: prediction.description,
        place_id: prediction.place_id,
      }));

      setSuggestions(predictions);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  const handleGeocode = async (textOverride?: string, placeId?: string) => {
    try {
      Keyboard.dismiss();
      setSuggestions([]);
      setStatusMessage("Looking up address...");

      let location: any[] = [];

      if (placeId) {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              place_id: placeId,
              key: GOOGLE_API_KEY,
            },
          }
        );
        location = res.data.results;
      } else {
        location = await Location.geocodeAsync(textOverride || destination);
      }

      if (location.length > 0) {
        const coords = location[0].geometry?.location || location[0];
        setTargetCoords({ latitude: coords.lat, longitude: coords.lng });
        setDestination(textOverride || destination);
        setStatusMessage("Target location set.");
      } else {
        Alert.alert("Address not found", "Please enter a valid location.");
        setStatusMessage("Invalid address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert("Geocoding error", "Failed to convert address to location.");
      setStatusMessage("Error occurred.");
    }
  };

  const playAlarmSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/homecoming_samsung.mp3"),
      {
        shouldPlay: true,
        isLooping: true,
      }
    );
    alarmSound = sound;
  };

  const stopAlarmSound = async () => {
    if (alarmSound) {
      await alarmSound.stopAsync();
      await alarmSound.unloadAsync();
      alarmSound = null;
    }
  };

  const triggerAlarm = async () => {
    await playAlarmSound();

    Alert.alert("📍 Alarm", "You're near your destination!", [
      {
        text: "Stop Alarm",
        onPress: async () => {
          await stopAlarmSound();
        },
      },
    ]);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📍 Alarm",
        body: "You have arrived within 1km of your target!",
      },
      trigger: null,
    });
  };

  const cancelAlarm = () => {
    setAlarmSet(false);
    setStatusMessage("Alarm deactivated.");
  };

  const getDistanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number) => (value * Math.PI) / 180;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📍 Location-Based Alarm</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination address"
          value={destination}
          onChangeText={(text) => {
            setDestination(text);
            fetchSuggestions(text);
          }}
        />
        <Pressable onPress={() => handleGeocode()} style={styles.icon}>
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
              onPress={() => handleGeocode(item.description, item.place_id)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {targetCoords && (
        <Text style={{ marginVertical: 10 }}>
          Target set at: {targetCoords.latitude.toFixed(5)},{" "}
          {targetCoords.longitude.toFixed(5)}
        </Text>
      )}

      <View style={{ marginTop: 10, gap: 10 }}>
        <Button
          title="Start Location Alarm"
          onPress={() => setAlarmSet(true)}
          disabled={alarmSet || !targetCoords}
        />
        {alarmSet && (
          <Button
            title="Deactivate Alarm"
            onPress={cancelAlarm}
            color="tomato"
          />
        )}
      </View>

      {alarmSet && <Text style={{ marginTop: 10 }}>Tracking location...</Text>}
      {statusMessage !== "" && (
        <Text style={{ marginTop: 10 }}>{statusMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingRight: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  icon: {
    paddingLeft: 10,
    paddingRight: 4,
  },
  dropdown: {
    width: "100%",
    maxHeight: 150,
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});
