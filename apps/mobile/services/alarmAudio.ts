import { Audio } from "expo-av";
import { scheduleNotification } from "@/services/notifications";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { getDistanceInKm } from "@/utils/distance";

let alarmSound: Audio.Sound | null = null;

export async function playAlarmSound() {
  const { sound } = await Audio.Sound.createAsync(
    require("../assets/sounds/homecoming_samsung.mp3"),
    { shouldPlay: true, isLooping: true }
  );
  alarmSound = sound;
}

export async function stopAlarmSound() {
  if (alarmSound) {
    await alarmSound.stopAsync();
    await alarmSound.unloadAsync();
    alarmSound = null;
  }
}

export async function triggerAlarm() {
  await playAlarmSound();
  Alert.alert("📍 Alarm", "You're near your destination!", [
    {
      text: "Stop Alarm",
      onPress: async () => {
        await stopAlarmSound();
      },
    },
  ]);
  await scheduleNotification();
}

export const startLocationAlarm = (
  targetCoords: { latitude: number; longitude: number },
  onTrigger: () => void
) => {
  const interval = setInterval(async () => {
    try {
      const current = await Location.getCurrentPositionAsync({});
      const distance = getDistanceInKm(
        current.coords.latitude,
        current.coords.longitude,
        targetCoords.latitude,
        targetCoords.longitude
      );

      if (distance <= 1.0) {
        await triggerAlarm();
        onTrigger(); // to clear alarmSet in hook
        clearInterval(interval);
      }
    } catch (err) {
      console.error("Alarm location check failed:", err);
    }
  }, 5000);

  return interval;
};
