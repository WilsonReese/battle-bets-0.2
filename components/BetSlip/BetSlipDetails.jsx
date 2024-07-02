import { FlatList, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { useBetContext } from "../contexts/BetContext";

export function BetSlipDetails({ budget, totalBet }) {
    const { bets } = useBetContext();

    const renderItem = ({ item }) => (
        <View style={s.betItem}>
          <Txt style={s.betText}>{item.type} - ${item.betAmount} - Payout: {item.payout}</Txt>
        </View>
      );
  
    return (
    <View style={s.container}>
      <Txt style={s.betDetailsText}>Spread and Over/Unders Here</Txt>
      <FlatList
        data={bets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
  betItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  betText: {
    fontSize: 16,
    color: 'black'
  },
});
