import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingRight: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  icon: {
    paddingLeft: 10,
    paddingRight: 4,
  },
  dropdown: {
    width: "100%",
    maxHeight: 150,
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  buttonGroup: {
    gap: 10,
    marginTop: 10,
  },
});
