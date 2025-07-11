import React, { memo, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { IncrementBtn } from "../general/Buttons/IncrementBtn";
import { LoadingIndicator } from "../general/LoadingIndicator";
import { useBetStore } from "../../state/useBetStore";
import { BETTING_RULES } from "../../utils/betting-rules";

function BetSelectorComponent({
	// option,
	// minBet,
	// maxBet,
	// payout,
	// bet,
	// budget,
	// remainingBudget,
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

  // 3) Sync local when the store changes
  useEffect(() => {
    setBetAmount(bet.bet_amount);
  }, [bet.bet_amount]);

	const increment = 100;
	const isBudgetMaxed = useBetStore((state) => state.budgetStatus.spreadOU);

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

// import { Pressable, StyleSheet, View } from "react-native";
// import { Txt } from "../general/Txt";
// import { FontAwesome6 } from "@expo/vector-icons";
// import { IncrementBtn } from "../general/Buttons/IncrementBtn";
// import { useBetOps, useBets } from "../contexts/BetContext";
// import { useState, useEffect } from "react";

// export function BetSelector({ betId, closeSelection, minBet, maxBet, payout }) {
// 	const { bets } = useBets();
// 	const { updateBet, getBetOptionType, getBudget, getTotalBetAmount } =
// 		useBetOps();
// 	const bet = bets.find((b) => b.id === betId);

// 	const budget = bet ? getBudget(getBetOptionType(bet.betType)) : 0;
// 	const totalBetAmount = bet
// 		? getTotalBetAmount(getBetOptionType(bet.betType))
// 		: 0;

// 	const [betAmount, setBetAmount] = useState(bet ? bet.betAmount : minBet);

// 	// update bet amount
// 	useEffect(() => {
// 		if (bet) {
// 			setBetAmount(bet.betAmount);
// 		}
// 	}, [bet]);

// 	const increment = 100;

// 	const incrementBet = () => {
// 		if (betAmount < maxBet && totalBetAmount + increment <= budget) {
// 			const newBetAmount = betAmount + increment;
// 			setBetAmount(newBetAmount);
// 			updateBet(betId, newBetAmount, payout);
// 		}
// 	};

// 	const decrementBet = () => {
// 		if (betAmount > minBet) {
// 			const newBetAmount = betAmount - increment;
// 			setBetAmount(newBetAmount);
// 			updateBet(betId, newBetAmount, payout);
// 		}
// 	};

// 	const minusSign = <FontAwesome6 name="minus" size={14} color="#F8F8F8" />;
// 	const plusSign = <FontAwesome6 name="plus" size={14} color="#F8F8F8" />;
// 	const closeIcon = (
// 		<FontAwesome6 name="circle-xmark" size={24} color="#F8F8F8" />
// 	);

// 	return (
// 		<View style={s.container}>
// 			<Pressable
// 				style={({ pressed }) => [s.closeIcon, pressed && { opacity: 0.5 }]}
// 				onPress={closeSelection}
// 			>
// 				<Txt style={s.text}>{closeIcon}</Txt>
// 			</Pressable>
// 			<View icon={minusSign} style={s.betAdjuster}>
// 				<IncrementBtn
// 					icon={minusSign}
// 					isEnabled={betAmount > minBet}
// 					onPress={decrementBet}
// 				/>
// 				<View>
// 					<Txt style={s.text}>${betAmount}</Txt>
// 				</View>
// 				<IncrementBtn
// 					icon={plusSign}
// 					isEnabled={betAmount < maxBet && totalBetAmount + increment <= budget}
// 					onPress={incrementBet}
// 				/>
// 			</View>
// 			<View style={s.toWin}>
// 				<Txt style={[s.text, s.toWinText]}>To Win:</Txt>
// 				<Txt style={[s.text]}>${Math.round(betAmount * payout)}</Txt>
// 			</View>
// 		</View>
// 	);
// }

// import React, { memo, useEffect, useState } from "react";
// import { Pressable, StyleSheet, View } from "react-native";
// import { Txt } from "../general/Txt";
// import { FontAwesome6 } from "@expo/vector-icons";
// import { IncrementBtn } from "../general/Buttons/IncrementBtn";
// import { useBetOps, useBets } from "../contexts/BetContext";
// import { LoadingIndicator } from "../general/LoadingIndicator";

// function BetSelectorComponent({
// 	betId,
// 	closeSelection,
// 	minBet,
// 	maxBet,
// 	payout,
// 	bets
// }) {
// 	// const { bets } = useBets();
// 	console.log('Bet Selector', bets)

// 	if (!bets) {
//   console.warn("Waiting for bets...");
//   return null; // or just null
// }

// 	const { updateBet, getBetOptionType, getBudget, getTotalBetAmount } = useBetOps();
// 	const bet = bets.find((b) => b.id === betId);

// 	const betType = bet ? getBetOptionType(bet.betType) : null;
// 	const budget = betType ? getBudget(betType) : 0;
// 	const totalBetAmount = betType ? getTotalBetAmount(betType) : 0;

// 	const [betAmount, setBetAmount] = useState(bet?.betAmount ?? minBet);
// 	const increment = 100;

// 	// Sync state with bet if it updates externally
// 	useEffect(() => {
// 		if (bet?.betAmount !== undefined) {
// 			setBetAmount(bet.betAmount);
// 		}
// 	}, [bet?.betAmount]);

// 	const incrementBet = () => {
// 		if (betAmount < maxBet && totalBetAmount - betAmount + betAmount + increment <= budget) {
// 			const newAmount = betAmount + increment;
// 			setBetAmount(newAmount);
// 			updateBet(betId, newAmount, payout);
// 		}
// 	};

// 	const decrementBet = () => {
// 		if (betAmount > minBet) {
// 			const newAmount = betAmount - increment;
// 			setBetAmount(newAmount);
// 			updateBet(betId, newAmount, payout);
// 		}
// 	};

// 	const minusSign = <FontAwesome6 name="minus" size={14} color="#F8F8F8" />;
// 	const plusSign = <FontAwesome6 name="plus" size={14} color="#F8F8F8" />;
// 	const closeIcon = <FontAwesome6 name="circle-xmark" size={24} color="#F8F8F8" />;

// 	return (
// 		<View style={s.container}>
// 			<Pressable
// 				style={({ pressed }) => [s.closeIcon, pressed && { opacity: 0.5 }]}
// 				onPress={closeSelection}
// 			>
// 				<Txt style={s.text}>{closeIcon}</Txt>
// 			</Pressable>

// 			<View style={s.betAdjuster}>
// 				<IncrementBtn
// 					icon={minusSign}
// 					isEnabled={betAmount > minBet}
// 					onPress={decrementBet}
// 				/>
// 				<View>
// 					<Txt style={s.text}>${betAmount}</Txt>
// 				</View>
// 				<IncrementBtn
// 					icon={plusSign}
// 					isEnabled={
// 						betAmount < maxBet &&
// 						totalBetAmount - betAmount + betAmount + increment <= budget
// 					}
// 					onPress={incrementBet}
// 				/>
// 			</View>

// 			<View style={s.toWin}>
// 				<Txt style={[s.text, s.toWinText]}>To Win:</Txt>
// 				<Txt style={s.text}>${Math.round(betAmount * payout)}</Txt>
// 			</View>
// 		</View>
// 	);
// }

// export const BetSelector = memo(BetSelectorComponent);

// const s = StyleSheet.create({
// 	container: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		backgroundColor: "#425C70",
// 		marginHorizontal: 8,
// 		borderBottomLeftRadius: 8,
// 		borderBottomRightRadius: 8,
// 		paddingHorizontal: 12,
// 		paddingVertical: 6,
// 		borderColor: "#54D18C",
// 	},
// 	text: {
// 		fontSize: 14,
// 	},
// 	closeIcon: {
// 		flex: 1,
// 	},
// 	betAdjuster: {
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		alignItems: "center",
// 		paddingHorizontal: 12,
// 		flex: 3.3,
// 	},
// 	toWinText: {
// 		fontSize: 12,
// 		marginBottom: -4,
// 		fontFamily: "Saira_600SemiBold",
// 	},
// 	toWin: {
// 		flex: 1.5,
// 		alignItems: "flex-end",
// 	},
// });
