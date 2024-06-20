import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "./Txt";

export function BetAmount({}) {
  return (
    <View style={s.selector}>
      <TouchableOpacity style={s.activeSign}>
        <Txt>-</Txt>
      </TouchableOpacity>
      <View style={s.amount}>
        <Txt style={s.txt}>$0</Txt>
      </View>
      <TouchableOpacity style={s.activeSign}>
        <Txt>+</Txt>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 4,
  },
  activeSign: {
    backgroundColor: "#2271FA",
    height: 35,
    width: 35,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  amount: {
    width: 80,
    alignItems: "center",
  },
  txt: {
    color: "#061826",
  },
});
