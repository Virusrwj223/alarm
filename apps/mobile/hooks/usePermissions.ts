// hooks/usePermissions.ts
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function usePermissions() {
  const [locationPermission, setLocationPermission] = useState(false);

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

  return locationPermission;
}
