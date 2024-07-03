import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { useBetContext } from "../contexts/BetContext";
import { Bet } from "./Bet";

export function BetSlipDetails({ budget, totalBet }) {
  const { bets } = useBetContext();

  function renderBets(betType) {
    return bets
      .filter(bet => bet.betType === betType)
      .map((bet) => (
        <Bet key={bet.id} bet={bet} />
      ));
  }

  return (
    <ScrollView>
      <View style={s.container}>
      <BetSlipBudget
          betType={"Spread and Over/Under"}
          budget={budget}
          totalBet={totalBet}
        />
        <Txt style={s.betDetailsText}>Spread and Over/Unders Here</Txt>
        {renderBets('spread')}
        <Txt style={[s.betDetailsText, {alignSelf: 'flex-end'}]}>Total Payout: $$$$</Txt>
        <Txt style={[s.betDetailsText, {alignSelf: 'center'}]}>Add more bets</Txt>
        <BetSlipBudget
          betType={"Money Line"}
          budget={budget}
          totalBet={totalBet}
        />
        <Txt style={s.betDetailsText}>Money Line Here</Txt>
        <Txt style={[s.betDetailsText, {alignSelf: 'flex-end'}]}>Total Payout: $$$$</Txt>
        <Txt style={[s.betDetailsText, {alignSelf: 'center'}]}>Add more bets</Txt>
        <BetSlipBudget
          betType={"Prop Bets"}
          budget={budget}
          totalBet={totalBet}
        />
        <Txt style={s.betDetailsText}>Prop Bets Here</Txt>
        <Txt style={[s.betDetailsText, {alignSelf: 'flex-end'}]}>Total Payout: $$$$</Txt>
        <Txt style={[s.betDetailsText, {alignSelf: 'center'}]}>Add more bets</Txt>
      </View>

      {/* This creates the space needed for the ScrollView to show everything  */}
      <View style={{height: 50}}></View> 
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
