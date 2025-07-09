import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { BETTING_RULES, DEFAULT_BUDGETS } from "../../../utils/betting-rules";
import React, { useEffect, useRef, useState } from "react";
import { useBetSelection } from "../../contexts/BetSelectionContext";
import { addBetToContext } from "../../../utils/betDispatcher";
import { useBetStore } from "../../../state/useBetStore";

function _Spread({ spreadOptions, game, bets }) {
	if (!spreadOptions || spreadOptions.length < 2) {
		return null; // Ensure there are at least two options (home and away)
	}

	const awaySpread = spreadOptions[0]; // Assuming the first option is for the away team
	const homeSpread = spreadOptions[1]; // Assuming the second option is for the home team
	const { minBet, maxBet } = BETTING_RULES["spread"];
	// const budget = DEFAULT_BUDGETS["spreadOU"];
	// const totalUsed = useRef(
	// 	useBetStore.getState().getTotalForCategory("spread")
	// );

	// console.log("total used", totalUsed);

	// const { budgetStatus } = useBetSelection();
	const [selectedOption, setSelectedOption] = useState(null);
	const [bet, setBet] = useState(null);
	// const [isDisabled, setIsDisabled] = useState(false);

	const isDisabled = useBetStore((state) => state.budgetStatus.spreadOU);

	console.log("SpreadOptions for game", game.id, spreadOptions);

	// useEffect(() => {
	// 	setIsDisabled(budgetStatus.spreadOU);
	// }, [budgetStatus.spreadOU]);

	const isOptionOneSelected = selectedOption === "optionOne";
	const isOptionTwoSelected = selectedOption === "optionTwo";

	// ====== FUNCTIONS ======

	const handleOptionPress = (optionKey, betOption) => {
		const isSame = selectedOption === optionKey;

		if (isSame) {
			// Deselect: remove the bet from the store
			useBetStore.getState().removeBet(betOption.id);
			setSelectedOption(null);
			setBet(null);
		} else {
			// Select: add a new bet
			const newBet = {
				bet_amount: minBet,
				to_win_amount: Math.round(minBet * betOption.payout),
				bet_option_id: betOption.id,
				betslip_id: "to-come-from-context", // placeholder
				title: betOption.title,
				category: betOption.category,
				isNew: true,
				payout: betOption.payout,
				game,
				addedAt: Date.now(),
			};

			useBetStore.getState().addBet(newBet);
			setSelectedOption(optionKey);
			setBet(newBet);
		}
	};

	// Inside your component body
	useEffect(() => {
		const allBets = useBetStore.getState().bets;
		console.log("📦 Zustand Bets (at mount):", allBets);
	}, []);

	return (
		<View>
			<BetTypeHeading heading={"SPREAD"} />
			<View style={s.optionsContainer}>
				<BetOption
					title={awaySpread.title}
					payout={awaySpread.payout}
					isEnabled={!isDisabled}
					isSelected={isOptionOneSelected}
					onPress={() => handleOptionPress("optionOne", awaySpread)}
				/>
				<BetOption
					title={homeSpread.title}
					payout={homeSpread.payout}
					isEnabled={!isDisabled}
					isSelected={isOptionTwoSelected}
					onPress={() => handleOptionPress("optionTwo", homeSpread)}
				/>
			</View>
			<Animated.View
				style={{ height: selectedOption ? 54 : 0, overflow: "hidden" }}
			>
				{selectedOption && (
					<BetSelector
						option={selectedOption}
						minBet={minBet}
						maxBet={maxBet}
						payout={bet?.to_win_amount / bet?.bet_amount || 0}
						bet={bet}
						// budget={budget}
						closeSelection={() => {
							useBetStore.getState().removeBet(bet.bet_option_id);
							setSelectedOption(null);
							setBet(null);
						}}
					/>
				)}
			</Animated.View>
		</View>
	);
}

export const Spread = React.memo(_Spread);

const s = StyleSheet.create({
	optionsContainer: {
		flexDirection: "row",
		gap: 4,
		justifyContent: "space-between",
	},
});

// import { Animated, StyleSheet, View } from "react-native";
// import { BetTypeHeading } from "../BetTypeHeading";
// import { BetSelector } from "../BetSelector";
// import { BetOption } from "../BetOption";
// import { useBetLogic } from "../../../hooks/useBetLogic";
// import { BETTING_RULES } from "../../../utils/betting-rules";
// import React from "react";

// function _Spread({ spreadOptions, game }) {
// 	if (!spreadOptions || spreadOptions.length < 2) {
// 		return null; // Ensure there are at least two options (home and away)
// 	}

// 	// console.log("🔄 Spread rendered for game", game.id);

// 	const awaySpread = spreadOptions[0]; // Assuming the first option is for the away team
// 	const homeSpread = spreadOptions[1]; // Assuming the second option is for the home team
// 	const awaySpreadLongTitle = awaySpread.long_title;
// 	const awaySpreadShortTitle = awaySpread.title;
// 	const homeSpreadLongTitle = homeSpread.long_title;
// 	const homeSpreadShortTitle = homeSpread.title;

// 	const payouts = {
// 		optionOne: awaySpread.payout,
// 		optionTwo: homeSpread.payout,
// 	};

// 	const betOptionIDs = {
// 		optionOne: awaySpread.id,
// 		optionTwo: homeSpread.id,
// 	};

// 	// const {
// 	// 	selection,
// 	// 	isEnabled,
// 	// 	animatedHeight,
// 	// 	toggleBet,
// 	// 	betType,
// 	// 	currentBetId,
// 	// } = useBetLogic(
// 	// 	"spread",
// 	// 	awaySpreadLongTitle,
// 	// 	homeSpreadLongTitle,
// 	// 	payouts,
// 	// 	betOptionIDs,
// 	// 	awaySpreadShortTitle,
// 	// 	homeSpreadShortTitle,
// 	// 	game,
// 	// 	bets
// 	// );
// 	const { minBet, maxBet } = BETTING_RULES['spread'];

// 	return (
// 		<View>
// 			<BetTypeHeading heading={"SPREAD"} />
// 			<View style={s.optionsContainer}>
// 				<BetOption
// 					title={awaySpread.title}
// 					payout={awaySpread.payout}
// 					// isSelected={selection.optionOne}
// 					// isEnabled={isEnabled}
// 					// onPress={() => toggleBet("optionOne")}
// 				/>
// 				<BetOption
// 					title={homeSpread.title}
// 					payout={homeSpread.payout}
// 					// isSelected={selection.optionTwo}
// 					// isEnabled={isEnabled}
// 					// onPress={() => toggleBet("optionTwo")}
// 				/>
// 			</View>
// 			<Animated.View style={{ height: 100, overflow: "hidden" }}>
// 				{/* {selection.optionOne && ( */}
// 					<BetSelector
// 						option="optionOne"
// 						// closeSelection={() => toggleBet("optionOne")}
// 						minBet={minBet}
// 						maxBet={maxBet}
// 						payout={awaySpread.payout}
// 						// betId={currentBetId}
// 						// bets={bets}
// 					/>
// 				{/* )} */}
// 				{/* {selection.optionTwo && ( */}
// 					<BetSelector
// 						option="optionTwo"
// 						// closeSelection={() => toggleBet("optionTwo")}
// 						minBet={minBet}
// 						maxBet={maxBet}
// 						payout={homeSpread.payout}
// 						// betId={currentBetId}
// 						// bets={bets}
// 					/>
// 				{/* )} */}
// 			</Animated.View>
// 		</View>
// 	);
// }

// export const Spread = React.memo(_Spread);

// const s = StyleSheet.create({
// 	optionsContainer: {
// 		flexDirection: "row",
// 		gap: 4,
// 		justifyContent: "space-between",
// 	},
// });
