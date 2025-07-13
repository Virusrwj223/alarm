// File: stores/radiusStore.ts
import { create } from "zustand";

interface RadiusStore {
  radius: number;
  setRadius: (r: number) => void;
}

export const useRadiusStore = create<RadiusStore>((set) => ({
  radius: 1,
  setRadius: (r) => set({ radius: r / 1000 }),
}));
