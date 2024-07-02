import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";

export function BetSlipDetails({ budget, totalBet }) {
  return (
    <View style={s.container}>
      <Txt style={s.betDetailsText}>Spread and Over/Unders Here</Txt>
      <BetSlipBudget
        betType={"Money Line"}
        budget={budget}
        totalBet={totalBet}
      />
      <Txt style={s.betDetailsText}>Money Line Here</Txt>
      <BetSlipBudget
        betType={"Prop Bets"}
        budget={budget}
        totalBet={totalBet}
      />
       <Txt style={s.betDetailsText}>Money Line Here</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingHorizontal: 8,
  },
  betDetailsText: {
    color: "#061826",
  },
});
