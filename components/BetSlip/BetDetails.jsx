import React from "react";
import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetDetails({ name, matchup, time, multiplier, betNameColor, payoutColor}) {
  return (
		<View style={s.container}>
			<View style={s.betDetailsContainer}>
				<View>
					<Txt style={[s.smallTxt, { color: betNameColor || s.betNameTxt.color }]}>{matchup}</Txt>
				</View>
				<View>
					<Txt style={[s.betNameTxt, { color: betNameColor || s.betNameTxt.color }]}>{name}</Txt>
				</View>
			</View>
			<View style={[s.betPayoutContainer, { backgroundColor: payoutColor || s.betPayoutContainer.backgroundColor }]}>
				<Txt style={[s.payoutTxt]}>x{multiplier}</Txt>
			</View>
		</View>
  );
}

const s = StyleSheet.create({
	container: {
		paddingVertical: 4,
		flexDirection: 'row',
		alignItems: 'center',
	},
	betDetailsContainer: {
		flex: 1,
		paddingRight: 4,
	},
	betPayoutContainer: {
		// flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingLeft: 4,
		borderRadius: 4,
		backgroundColor: '#F8F8F8',
		height: 20,
		width: 40,
	},
  betNameTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 15,
    lineHeight: 18,
    textAlignVertical: "center",
    paddingTop: 3,
		color: "#061826",
  },
	payoutTxt: {
		// color: "#061826",
		fontSize: 11,
    color: '#061826',
    fontFamily: "Saira_600SemiBold",
	},
  smallTxt: {
    fontSize: 10,
		color: '#C7CDD1'
  },
});
