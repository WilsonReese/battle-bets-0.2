import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { useBetContext } from "../contexts/BetContext";
import { Bet } from "./Bet";

export function BetSlipDetails({ budget, totalBet }) {
  const { bets } = useBetContext();

  function renderBets() {
    return bets.map((bet) => (
      <Bet key={bet.id} bet={bet} />
    ));
  }

  return (
    <ScrollView>
      <View style={s.container}>
        <Txt style={s.betDetailsText}>Spread and Over/Unders Here</Txt>
        {renderBets()}
        <Txt style={[s.betDetailsText, {alignSelf: 'flex-end'}]}>Total Payout: $$$$</Txt>
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

      {/* This creates the space needed for the ScrollView to show everything  */}
      <View style={{height: 90}}></View> 
    </ScrollView>
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
