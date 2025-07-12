import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const mapTabStyles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 50,
    width: width - 30,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4,
    padding: 10,
    zIndex: 2,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  suggestionBox: {
    marginTop: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
