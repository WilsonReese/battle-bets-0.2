import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function Row({ betslip }) {
  return (
    <View style={s.container}>
      <View style={s.firstRowElement}>
        <Txt style={s.txt}>Reese</Txt>
      </View>
      <View style={s.rowElement}>
        <Txt style={s.txt}>${betslip.earnings}</Txt>
      </View>
      <View style={s.rowElement}>
        <Txt style={s.txt}>$10000</Txt>
      </View>
      <View style={s.rowElement}>
        <Txt style={s.txt}>Button</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firstRowElement: {
    flex: 1.75,
  },
  rowElement: {
    flex: 1,
    alignItems: "center",
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
});
