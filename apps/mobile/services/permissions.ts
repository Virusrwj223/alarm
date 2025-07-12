import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export const requestAppPermissions = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (Device.isDevice) {
    await Notifications.requestPermissionsAsync();
  }
  return status === "granted";
};
