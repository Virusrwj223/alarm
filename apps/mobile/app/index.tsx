"use client";

import { useState, useEffect } from "react";
import { Text, View, Button, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function HomeScreen() {
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);

  useEffect(() => {
    if (Device.isDevice) {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (alarmSet) {
      interval = setInterval(() => {
        const now = new Date();
        if (
          now.getHours() === alarmTime.getHours() &&
          now.getMinutes() === alarmTime.getMinutes() &&
          now.getSeconds() === alarmTime.getSeconds()
        ) {
          triggerAlarm();
          setAlarmSet(false);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [alarmSet, alarmTime]);

  const triggerAlarm = async () => {
    Alert.alert("⏰ Alarm", "Time's up!");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Alarm",
        body: "It's time!",
      },
      trigger: null,
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Alarm Clock</Text>

      <Button title="Pick Time" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={alarmTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(_, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) setAlarmTime(selectedTime);
          }}
        />
      )}

      <Text style={{ marginVertical: 20 }}>
        Alarm set for: {alarmTime.toLocaleTimeString()}
      </Text>

      <Button
        title="Start Alarm"
        onPress={() => setAlarmSet(true)}
        disabled={alarmSet}
      />
    </View>
  );
}
