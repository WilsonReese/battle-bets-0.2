import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { BETTING_RULES, DEFAULT_BUDGETS } from "../../../utils/betting-rules";
import React, { useEffect, useRef, useState } from "react";
import { useBetSelection } from "../../contexts/BetSelectionContext";
import { addBetToContext } from "../../../utils/betDispatcher";
import { useBetStore } from "../../../state/useBetStore";

function _Spread({ spreadOptions, game }) {
	if (!spreadOptions || spreadOptions.length < 2) {
		return null; // Ensure there are at least two options (home and away)
	}

	const [isOpen, setIsOpen] = useState(false);
	const animatedHeight = useRef(new Animated.Value(0)).current;
	const isBudgetMaxed = useBetStore((state) => state.budgetStatus.spreadOU);

	const awaySpread = spreadOptions[0]; // Assuming the first option is for the away team
	const homeSpread = spreadOptions[1]; // Assuming the second option is for the home team
	const { minBet, maxBet } = BETTING_RULES["spread"];

	// Look up each option by its bet_option_id
  const awayBet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === awaySpread.id)
  );
  const homeBet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === homeSpread.id)
  );

  // If either exists, we’re “open”
  useEffect(() => {
    setIsOpen(!!awayBet || !!homeBet);
  }, [awayBet, homeBet]);

	// 3) Animate the height when isOpen changes
	useEffect(() => {
		Animated.timing(animatedHeight, {
			toValue: isOpen ? 54 : 0,
			duration: 100,
			useNativeDriver: false,
		}).start();
	}, [isOpen]);

	const selectedBetOptionId = awayBet ? awaySpread.id : homeBet ? homeSpread.id : null;

	const store = useBetStore.getState();
  const toggle = (opt) => {
    if (selectedBetOptionId === opt.id) {
      store.removeBet(opt.id);
    } else {
      // remove whichever one was selected
      if (selectedBetOptionId) store.removeBet(selectedBetOptionId);
      store.addBet({
        bet_amount: minBet,
        to_win_amount: Math.round(minBet * opt.payout),
        bet_option_id: opt.id,
        category: "spread",
        game,
        title: opt.title,
        payout: opt.payout,
        addedAt: Date.now(),
        isNew: true,
      });
    }
  };

	return (
		<View>
			<BetTypeHeading heading={"SPREAD"} />
			<View style={s.optionsContainer}>
				<BetOption
					title={awaySpread.title}
					payout={awaySpread.payout}
					isEnabled={!isBudgetMaxed}
					isSelected={selectedBetOptionId === awaySpread.id}
					onPress={() => toggle(awaySpread)}
				/>
				<BetOption
					title={homeSpread.title}
					payout={homeSpread.payout}
					isEnabled={!isBudgetMaxed}
					isSelected={selectedBetOptionId === homeSpread.id}
					onPress={() => toggle(homeSpread)}
				/>
			</View>
			{/* animated selector */}
			<Animated.View
				style={[
					s.selectorWrapper,
					{
						height: animatedHeight,
						opacity: animatedHeight.interpolate({
							inputRange: [0, 54],
							outputRange: [0, 1],
						}),
					},
				]}
			>
				{selectedBetOptionId && (
					<BetSelector
						betOptionId={selectedBetOptionId}
						closeSelection={() =>
							useBetStore.getState().removeBet(selectedBetOptionId)
						}
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
	selectorWrapper: {
    overflow: "hidden",
    // marginTop: 4,
  },
});