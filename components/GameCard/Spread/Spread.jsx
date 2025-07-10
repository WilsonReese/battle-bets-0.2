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

	// 1) Subscribe to the single spread‐bet for this game
	const thisSpreadBet = useBetStore((s) =>
		s.bets.find((b) => b.category === "spread" && b.game.id === game.id)
	);

	// // 2) Local open/closed flag to drive animation
  // const [isOpen, setIsOpen] = useState(false);
  // const animatedHeight = useRef(new Animated.Value(0)).current;

	// // 3) Whenever the store’s spread‐bet appears/disappears, update isOpen
  // useEffect(() => {
  //   setIsOpen(!!thisSpreadBet);
  // }, [thisSpreadBet]);

	// // 4) Animate height on open/close
  // useEffect(() => {
  //   Animated.timing(animatedHeight, {
  //     toValue: isOpen ? 54 : 0,
  //     duration: 100,
  //     useNativeDriver: false,
  //   }).start();
  // }, [isOpen]);

	const selectedBetOptionId = thisSpreadBet?.bet_option_id ?? null;
	const isOptionOne = selectedBetOptionId === awaySpread.id;
	const isOptionTwo = selectedBetOptionId === homeSpread.id;

	const { minBet, maxBet } = BETTING_RULES["spread"];

	// const [selectedOption, setSelectedOption] = useState(null);
	// const [selectedBetOption, setSelectedBetOption] = useState(null);
	// const [bet, setBet] = useState(null);
	// const [isDisabled, setIsDisabled] = useState(false);

	const isBudgetMaxed = useBetStore((state) => state.budgetStatus.spreadOU);

  // Toggling:
  //  - if nothing is selected, we add
  //  - if the same option is tapped, we remove
  //  - if the *other* option is tapped, we remove the old one then add the new one
  const toggle = (opt) => {
    const store = useBetStore.getState();
    if (!thisSpreadBet) {
      // no spread yet → add it
      store.addBet(buildSpreadBet(opt));
    } else if (thisSpreadBet.bet_option_id === opt.id) {
      // tapping the same → remove it
      store.removeBet(opt.id);
    } else {
      // a different one → remove old, then add new
      store.removeBet(thisSpreadBet.bet_option_id);
      store.addBet(buildSpreadBet(opt));
    }
  };

  const buildSpreadBet = (opt) => ({
    bet_amount: minBet,
    to_win_amount: Math.round(minBet * opt.payout),
    bet_option_id: opt.id,
    category: "spread",
    game,
    title: opt.title,
    payout: opt.payout,
    addedAt: Date.now(),
  });

	// // Inside your component body
	// useEffect(() => {
	// 	const allBets = useBetStore.getState().bets;
	// 	console.log("📦 Zustand Bets (at mount):", allBets);
	// }, []);

	return (
		<View>
			<BetTypeHeading heading={"SPREAD"} />
			<View style={s.optionsContainer}>
				<BetOption
					title={awaySpread.title}
					payout={awaySpread.payout}
					isEnabled={!isBudgetMaxed}
					isSelected={isOptionOne}
					onPress={() => toggle(awaySpread)}
				/>
				<BetOption
					title={homeSpread.title}
					payout={homeSpread.payout}
					isEnabled={!isBudgetMaxed}
					isSelected={isOptionTwo}
					onPress={() => toggle(homeSpread)}
				/>
			</View>
			{thisSpreadBet ? (
				<Animated.View
					style={{ height: 54 }}
				>
					<BetSelector
						betOptionId={thisSpreadBet.bet_option_id}
						closeSelection={() => {
							useBetStore.getState().removeBet(thisSpreadBet.bet_option_id)
						}}
					/>
				</Animated.View>
			) : null}
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
