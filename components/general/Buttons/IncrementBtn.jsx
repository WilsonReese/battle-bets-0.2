import { Pressable, StyleSheet } from "react-native";
import { Txt } from "../Txt";

export function IncrementBtn({ isEnabled, icon, style, onPress }) {
  function checkIfEnabled() {
    return isEnabled ? s.enabled : s.disabled;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        s.btnIncrement,
        checkIfEnabled(),
        isEnabled && pressed && { opacity: 0.5 },
        style,
      ]}
      onPress={isEnabled ? onPress : null}
    >
      <Txt>{icon}</Txt>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btnIncrement: {
    borderRadius: 50,
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#B8C3CC",
  },
  enabled: {
    backgroundColor: "#184EAD",
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
