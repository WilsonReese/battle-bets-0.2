import React, { memo, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { IncrementBtn } from "../general/Buttons/IncrementBtn";
import { LoadingIndicator } from "../general/LoadingIndicator";
import { useBetStore } from "../../state/useBetStore";
import { BETTING_RULES, categoryToBudgetKey } from "../../utils/betting-rules";

function BetSelectorComponent({
	betOptionId,
	closeSelection,
}) {
  // 1) Always read the *live* bet from Zustand
  const bet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === betOptionId)
  );

	console.log(bet.category)
  
	// 2) Derive your rules straight from bet.category
  const { minBet, maxBet } = BETTING_RULES[bet.category] || {};
  const { payout } = bet;
  const [betAmount, setBetAmount] = useState(bet.bet_amount);

	const budgetKey = categoryToBudgetKey(bet.category);

  // 3) Sync local when the store changes
  useEffect(() => {
    setBetAmount(bet.bet_amount);
  }, [bet.bet_amount]);

	const increment = 100;
	const isBudgetMaxed = useBetStore((s) =>
    budgetKey ? s.budgetStatus[budgetKey] : false
  );

	// Sync state with bet if it updates externally

	const incrementBet = () => {
		if (betAmount < maxBet) {
			const newAmount = betAmount + increment;
			setBetAmount(newAmount);
			useBetStore.getState().updateBet(bet.bet_option_id, newAmount);
		}
	};

	const decrementBet = () => {
		if (betAmount > minBet) {
			const newAmount = betAmount - increment;
			setBetAmount(newAmount);
			useBetStore.getState().updateBet(bet.bet_option_id, newAmount);
		}
	};

	const minusSign = <FontAwesome6 name="minus" size={14} color="#F8F8F8" />;
	const plusSign = <FontAwesome6 name="plus" size={14} color="#F8F8F8" />;
	const closeIcon = (
		<FontAwesome6 name="circle-xmark" size={24} color="#F8F8F8" />
	);

	if (!bet) return null;

	return (
		<View style={s.container}>
			<Pressable
				style={({ pressed }) => [s.closeIcon, pressed && { opacity: 0.5 }]}
				onPress={closeSelection}
			>
				<Txt style={s.text}>{closeIcon}</Txt>
			</Pressable>

			<View style={s.betAdjuster}>
				<IncrementBtn
					icon={minusSign}
					isEnabled={betAmount > minBet}
					onPress={decrementBet}
				/>
				<View>
					<Txt style={s.text}>${betAmount}</Txt>
				</View>
				<IncrementBtn
					icon={plusSign}
					isEnabled={betAmount < maxBet && !isBudgetMaxed}
					onPress={incrementBet}
				/>
			</View>

			<View style={s.toWin}>
				<Txt style={[s.text, s.toWinText]}>To Win:</Txt>
				<Txt style={s.text}>${Math.round(betAmount * payout)}</Txt>
			</View>
		</View>
	);
}

export const BetSelector = memo(BetSelectorComponent);

const s = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#425C70",
		marginHorizontal: 8,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderColor: "#54D18C",
	},
	text: {
		fontSize: 14,
	},
	closeIcon: {
		flex: 1,
	},
	betAdjuster: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 12,
		flex: 3.3,
	},
	toWinText: {
		fontSize: 12,
		marginBottom: -4,
		fontFamily: "Saira_600SemiBold",
	},
	toWin: {
		flex: 1.5,
		alignItems: "flex-end",
	},
});