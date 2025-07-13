// hooks/useAlarm.ts
import { useEffect } from "react";
import { startLocationAlarm } from "@/services/alarmAudio";

export default function useAlarm(
  alarmSet: boolean,
  targetCoords: { latitude: number; longitude: number } | null,
  locationPermission: boolean,
  radius: number,
  onTrigger: () => void
) {
  useEffect(() => {
    let interval: any;

    if (alarmSet && targetCoords && locationPermission) {
      interval = startLocationAlarm(targetCoords, radius, () => {
        onTrigger();
      });
    }

    return () => clearInterval(interval);
  }, [alarmSet, targetCoords, locationPermission]);
}
