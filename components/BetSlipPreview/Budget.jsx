import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function Budget({ betType }) {
  return (
    <View style={s.container}>
      <View>
        <Txt style={[s.text, s.boldText]}>{betType}</Txt>
      </View>
      <View style={s.budgetRow}>
        <Txt style={s.text}>Budget Remaining:</Txt>
        <Txt style={[s.text, s.boldText]}>$2000</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 20,
  },
  text: {
    color: "#061826",
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boldText: {
    fontFamily: 'Saira_600SemiBold'
  }
});
