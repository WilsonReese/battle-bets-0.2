import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../Txt";

export function IncrementBtn({ isEnabled, icon, style, onPress }) {
  function checkIfEnabled() {
    return isEnabled ? s.enabled : s.disabled;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        s.pressableArea,
        isEnabled && pressed && { opacity: 0.6 },
        style,
      ]}
      onPress={isEnabled ? onPress : null}
    >
      <View style={[s.btnIncrement, checkIfEnabled()]}>
        <Txt>{icon}</Txt>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  pressableArea: {
    paddingVertical: 5, // makes the touch target larger
    paddingHorizontal: 15,
    borderRadius: 50,
    // backgroundColor: 'blue'
  },
  btnIncrement: {
    height: 25,
    width: 25,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#B8C3CC",
  },
  enabled: {
    backgroundColor: "#54D18C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
