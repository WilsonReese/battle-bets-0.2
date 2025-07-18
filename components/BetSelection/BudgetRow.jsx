import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { ProgressIndicator } from "../BetSlip/ProgressIndicator";

export function BudgetRow({}) {
	return (
		<View style={s.container}>
			<View style={s.progressIndicatorsContainer}>
				<ProgressIndicator budgetCategory={"spreadOU"} />
				<ProgressIndicator budgetCategory={"moneyLine"} />
				<ProgressIndicator budgetCategory={"prop"} />
			</View>
			<View style={s.separatorLine} />
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		marginHorizontal: -8,
	},

	progressIndicatorsContainer: {
		// backgroundColor: "#184EAD",
		flexDirection: "row",
		// paddingVertical: 4,
		paddingHorizontal: 8,
		justifyContent: "space-between",
	},

	separatorLine: {
		// height: .5,
		backgroundColor: "#425C70",
	},
});
