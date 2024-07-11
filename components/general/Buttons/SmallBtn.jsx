import { Pressable, StyleSheet } from "react-native";
import { Txt } from "../Txt";

export function SmallBtn({ isEnabled, text, style, onPress }) {
  function checkIfEnabled() {
    return isEnabled ? s.enabled : s.disabled;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        s.btn,
        checkIfEnabled(),
        isEnabled && pressed && { opacity: 0.5 },
        style,
      ]}
      onPress={isEnabled ? onPress : null}
    >
      <Txt style={s.text}>{text}</Txt>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    borderRadius: 4,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: '#2271FA'
  },
  disabled: {
    backgroundColor: "#B8C3CC",
  },
  enabled: {
    backgroundColor: "#2271FA",
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
