import React from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetOps, useBets } from "../contexts/BetContext";
import { useBetStore } from "../../state/useBetStore";

export function ProgressIndicator({
	budgetCategory,
	isBetSlipShown,
	scrollViewRef,
	closeBetSlip,
}) {

	const remainingBudget = useBetStore((state) =>
		state.getRemainingBudget(budgetCategory)
	);

	const isBudgetMaxed = useBetStore((state) => state.budgetStatus[budgetCategory]);

	const betCategoryNames = {
		spreadOU: "Spread and Over/Under",
		moneyLine: "Money Line",
		prop: "Prop Bets",
	};

	const title = betCategoryNames[budgetCategory];

	return (
		<View style={[s.container]}>
			<View style={s.progressIndicator}>
				<Txt style={[s.title, isBudgetMaxed && s.budgetMaxed]}>{title}</Txt>
				<Txt style={[s.amount, isBudgetMaxed && s.budgetMaxed]}>{`$${remainingBudget} left`}</Txt>
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		// paddingVertical: 2,
		paddingHorizontal: 12,
		// flex: 1,
		// backgroundColor: 'green'
	},
	progressIndicator: {
		alignItems: "center",
		// borderBottomWidth: 4,
		// borderColor: "transparent", // Default border color
	},
	title: {
		// fontFamily: "Saira_600SemiBold",
		color: "#E4E6E7",
		fontSize: 12,
		marginBottom: -4
	},
	amount: {
		color: "#E4E6E7",
		fontSize: 12,
		fontFamily: "Saira_600SemiBold",
	},
	budgetMaxed: {
		color: "#6B8294",
	},
});
