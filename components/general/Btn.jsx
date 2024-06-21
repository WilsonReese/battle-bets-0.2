import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "./Txt";
// import { Txt } from "../../general/Txt";

export function Btn({ btnText, btnSize, isEnabled }) {
  if (!isEnabled) {
    return (
      <Pressable style={s.disabled}>
        <Txt>{btnText}</Txt>
      </Pressable>
    );
  } else if (isEnabled) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.5 : 1,
          },
          s.enabled,
        ]}
      >
        <Txt>{btnText}</Txt>
      </Pressable>
    );
  }
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
