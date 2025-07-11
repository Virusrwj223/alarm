import { Audio } from "expo-av";

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
