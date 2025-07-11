import * as Notifications from "expo-notifications";

export async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📍 Alarm",
      body: "You have arrived within 1km of your target!",
    },
    trigger: null,
  });
}
