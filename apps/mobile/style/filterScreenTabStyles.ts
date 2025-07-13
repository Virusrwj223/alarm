// File: style/filterScreenStyles.ts
import { StyleSheet } from "react-native";

export const filterScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  valueText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6600",
    textAlign: "center",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  rangeText: {
    fontSize: 14,
    color: "#888",
  },
  buttonWrapper: {
    marginTop: 32,
    borderRadius: 8,
    overflow: "hidden",
  },
});
