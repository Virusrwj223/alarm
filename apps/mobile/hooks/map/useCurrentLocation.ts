import { useEffect } from "react";
import * as Location from "expo-location";

export default function useCurrentLocation(setRegion: (region: any) => void) {
  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getCurrentLocation();
  }, []);
}
