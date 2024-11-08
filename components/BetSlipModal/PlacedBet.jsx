import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function PlacedBet({ bet }) {
  return (
    <View key={bet.id} style={s.betContainer}>
      <Txt style={s.txt}>{bet.bet_option.long_title}</Txt>
      <Txt style={s.txt}>Amount Won: ${bet.amount_won || 0}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  txt: {
    color: "#061826",
    fontSize: 14,
  },
});
