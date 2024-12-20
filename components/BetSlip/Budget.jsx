import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetTypeHeading } from "../GameCard/BetTypeHeading";

export function Budget({ betType, budget, totalBet }) {
  return (
    <View style={s.container}>
      <View>
        <BetTypeHeading heading={betType} style={{ fontSize: 16 }} />
      </View>
      <View style={s.budgetRow}>
          <Txt style={s.budgetText}>${totalBet}</Txt>
          <Txt style={s.text}> of </Txt>
          <Txt style={s.budgetText}>${budget}</Txt>
          <Txt style={s.text}> remaining</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    // paddingRight: 20,
  },
  text: {
    color: "#061826",
    fontSize: 14,
  },
  budgetRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginTop: -2,
  },
  budgetContainer: {
    flex: 2
  },
  remainingContainer: {
    flex: 3
  },
  budgetText: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
});
