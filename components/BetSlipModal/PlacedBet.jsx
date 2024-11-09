import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function PlacedBet({ bet, backgroundColor}) {
  return (
		<View style={s.container}>
			<View style={[s.betContainer, {backgroundColor: backgroundColor}]}>
				<Txt style={s.txt}>{bet.bet_option.long_title}</Txt>
				<Txt style={s.txt}>Amount Won: ${bet.amount_won || 0}</Txt>
			</View>
		</View>
  );
}

const s = StyleSheet.create({
  container: {
		paddingHorizontal: 8,
	},
	betContainer: {
    paddingHorizontal: 8,
  },
	txt: {
    color: "#061826",
    fontSize: 14,
  },
});
