import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "./Txt";

// need to make it so it can accept a second line

export function Btn({ btnText, btnSize, isEnabled }) {
  function checkIfEnabled() {
    return isEnabled ? s.enabled : s.disabled;
  }

  return (
    <Pressable style={checkIfEnabled()}>
      <Txt>{btnText}</Txt>
    </Pressable>
  );
}


const s = StyleSheet.create({
  disabled: {
    backgroundColor: "#B8C3CC",
    width: 112,
    height: 48,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  enabled: {
    backgroundColor: "#2271FA",
    width: 112,
    height: 48,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
