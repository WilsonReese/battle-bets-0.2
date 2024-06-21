import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "./Txt";
// import { Txt } from "../../general/Txt";

export function Btn({ btnText, btnSize, state }) {
  return (
    <TouchableOpacity style={s.backgroundDisabled}>
      <Txt>{btnText}</Txt>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  backgroundDisabled: {
    backgroundColor: '#B8C3CC',
    width: 112,
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
