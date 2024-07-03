import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { useBetContext } from "../contexts/BetContext";

export function BetSlipDetails({ budget, totalBet }) {
  const { bets } = useBetContext();

  const renderItem = ({ item }) => (
    <View style={s.betItem}>
      <Txt style={s.betText}>
        {item.name} - ${item.betAmount} - To Win: {item.toWinAmount} - ID:{" "}
        {item.id} - Type: {item.betType}
      </Txt>
    </View>
  );

  function renderBets() {
    return bets.map((bet) => (
      <View key={bet.id} style={s.betItem}>
        <Txt style={s.betText}>
          {bet.name} - ${bet.betAmount} - To Win: {bet.toWinAmount} - ID:{" "}
          {bet.id} - Type: {bet.betType}
        </Txt>
      </View>
    ));
  }

  return (
    <ScrollView>
      <View style={s.container}>
        <Txt style={s.betDetailsText}>Spread and Over/Unders Here</Txt>
        {renderBets()}
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
  betItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  betText: {
    fontSize: 16,
    color: "black",
  },
});
