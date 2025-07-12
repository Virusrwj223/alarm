// hooks/useAlarm.ts
import { useEffect } from "react";
import * as Location from "expo-location";
import { getDistanceInKm } from "@/utils/distance";
import { startLocationAlarm } from "@/services/alarmAudio";

export default function useAlarm(
  alarmSet: boolean,
  targetCoords: { latitude: number; longitude: number } | null,
  locationPermission: boolean,
  onTrigger: () => void
) {
  useEffect(() => {
    let interval: any;

    if (alarmSet && targetCoords && locationPermission) {
      interval = startLocationAlarm(targetCoords, () => {
        onTrigger();
      });
    }

    return () => clearInterval(interval);
  }, [alarmSet, targetCoords, locationPermission]);
}
