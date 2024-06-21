import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "./Txt";

// need to make it so it can accept a second line

export function Btn({ btnText, btnSecondaryText, btnSize, isEnabled, icon }) {
  function checkIfEnabled() {
    return isEnabled ? s.enabled : s.disabled;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        s.btn,
        checkIfEnabled(),
        isEnabled && pressed && { opacity: 0.5 },
      ]}
    >
      <Txt style={s.btnText}>
        {btnText} {icon}
      </Txt>
      {btnSecondaryText && (
        <Txt style={s.btnSecondaryText}>{btnSecondaryText}</Txt>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    width: 112,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#B8C3CC",
  },
  enabled: {
    backgroundColor: "#2271FA",
  },
  btnText: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 18,
  },
  btnSecondaryText: {
    fontSize: 14,
    marginTop: -8,
  },
});
