import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { useBetContext } from "../contexts/BetContext";
import { BetTypeSection } from "./BetTypeSection";

export function BetSlipDetails({}) {
  const { bets } = useBetContext();

  function calculateTotalPayout() {
    return bets.reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  function hasBetsOfType(betType) {
    return bets.some((bet) => bet.betType === betType);
  }

  return (
    <ScrollView>
      <View style={s.container}>
        <BetSlipBudget betType={"Spread and Over/Under"} />
        {hasBetsOfType('spread') ? <BetTypeSection betType={"spread"} /> : <Txt style={s.text}>Placeholder</Txt>}
        <BetSlipBudget betType={"Money Line"} />
        {hasBetsOfType('money line') ? <BetTypeSection betType={"money line"} /> : <Txt style={s.text}>Placeholder</Txt>}
        <BetSlipBudget betType={"Prop Bets"} />
        {hasBetsOfType('prop') ? <BetTypeSection betType={"props"} /> : <Txt style={s.text}>Placeholder</Txt>}
      </View>
      <View style={s.payoutContainer}>
        <Txt style={s.payoutHeading}>Total Potential Payout: </Txt>
        <Txt style={s.payoutText}>${calculateTotalPayout()}</Txt>
      </View>

      {/* This creates the space needed for the ScrollView to show everything  */}
      <View style={{ height: 50 }}></View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingHorizontal: 8,
  },
  payoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderColor: "#B8C3CC",
    marginHorizontal: 8,
  },
  payoutHeading: {
    color: "#061826",
    textTransform: "uppercase",
    fontFamily: "Saira_600SemiBold",
    // fontSize: 14
  },
  payoutText: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 18,
  },
  text: {
    color: "#061826",
  }
});
