// hooks/useLocationAlarm.ts
import useDestination from "./useDestination";
import usePermissions from "./usePermissions";
import useAlarm from "./useAlarm";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useRadiusStore } from "@/stores/radiusStore";

export default function useLocationAlarm() {
  const {
    destination,
    setDestination,
    targetCoords,
    setTargetCoords,
    suggestions,
    fetchSuggestions,
    handleGeocodeSelection,
    setStatusMessage,
    statusMessage,
  } = useDestination();

  const { radius, setRadius } = useRadiusStore();

  const locationPermission = usePermissions();
  const [alarmSet, setAlarmSet] = useState(false);

  const { lat, lng, address } = useLocalSearchParams();

  useEffect(() => {
    if (!lat || !lng) return;

    const parsedLat = parseFloat(lat as string);
    const parsedLng = parseFloat(lng as string);

    const coords = { latitude: parsedLat, longitude: parsedLng };
    setTargetCoords(coords);
    setDestination(
      decodeURIComponent((address as string) ?? `${parsedLat}, ${parsedLng}`)
    );
    setStatusMessage("Target location set.");
  }, [lat, lng, address]);

  useAlarm(alarmSet, targetCoords, locationPermission, radius, () =>
    setAlarmSet(false)
  );

  return {
    destination,
    setDestination,
    suggestions,
    fetchSuggestions,
    handleGeocodeSelection,
    startAlarm: () => {
      if (targetCoords) {
        setAlarmSet(true);
        setStatusMessage("Target location set.");
      }
    },
    cancelAlarm: () => {
      setAlarmSet(false);
      setStatusMessage("");
    },
    alarmSet,
    statusMessage,
  };
}
