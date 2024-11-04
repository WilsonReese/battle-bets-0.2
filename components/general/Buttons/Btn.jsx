import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../Txt";

export function Btn({
  btnText,
  btnSecondaryText,
  btnSize,
  isEnabled,
  icon,
  style,
  onPress
}) {
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
      <Txt style={s.btnText}>
        {btnText}{icon}
      </Txt>
      {btnSecondaryText && (
        <Txt style={s.btnSecondaryText}>{btnSecondaryText}</Txt>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    // width: 112,
    // height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#B8C3CC",
  },
  enabled: {
    backgroundColor: "#54D18C",
  },
  btnText: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 16,
  },
  btnSecondaryText: {
    fontSize: 14,
    marginTop: -8,
  },
});
