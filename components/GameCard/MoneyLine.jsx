// import { Animated, StyleSheet, View } from "react-native";
// import { BetTypeHeading } from "./BetTypeHeading";
// import { BetSelector } from "./BetSelector";
// import { BetOption } from "./BetOption";
// import { useBetLogic } from "../../hooks/useBetLogic";
// import { BETTING_RULES } from "../../utils/betting-rules";

// export function MoneyLine({
// 	moneyLineOptions,
// 	homeTeam,
// 	awayTeam,
// 	moneyLineHome,
// 	moneyLineHomePayout,
// 	moneyLineAway,
// 	moneyLineAwayPayout,
// 	game,
// }) {
// 	if (!moneyLineOptions || moneyLineOptions.length < 2) {
// 		return null; // Ensure there are at least two options (home and away)
// 	}

//   console.log("🔄 Money Line rendered for game", game.id);

// 	const awayMoneyLine = moneyLineOptions[0]; // Assuming the first option is for the away team
// 	const homeMoneyLine = moneyLineOptions[1]; // Assuming the second option is for the home team
// 	const awayMoneyLineLongTitle = awayMoneyLine.long_title;
// 	const awayMoneyLineShortTitle = awayMoneyLine.title;
// 	const homeMoneyLineLongTitle = homeMoneyLine.long_title;
// 	const homeMoneyLineShortTitle = homeMoneyLine.title;

// 	const payouts = {
// 		optionOne: awayMoneyLine.payout,
// 		optionTwo: homeMoneyLine.payout,
// 	};

// 	const betOptionIDs = {
// 		optionOne: awayMoneyLine.id,
// 		optionTwo: homeMoneyLine.id,
// 	};
// 	const {
// 		selection,
// 		isEnabled,
// 		animatedHeight,
// 		toggleBet,
// 		betType,
// 		currentBetId,
// 	} = useBetLogic(
// 		"moneyLine",
// 		awayMoneyLineLongTitle,
// 		homeMoneyLineLongTitle,
// 		payouts,
// 		betOptionIDs,
// 		awayMoneyLineShortTitle,
// 		homeMoneyLineShortTitle,
// 		game
// 	);
// 	const { minBet, maxBet } = BETTING_RULES[betType];

// 	return (
// 		<View>
// 			<BetTypeHeading heading={"Money Line"} />
// 			<View style={s.optionsContainer}>
// 				<BetOption
// 					title={awayMoneyLine.title}
// 					payout={awayMoneyLine.payout}
// 					isSelected={selection.optionOne}
// 					isEnabled={isEnabled}
// 					onPress={() => toggleBet("optionOne")}
// 				/>
// 				<BetOption
// 					title={homeMoneyLine.title}
// 					payout={homeMoneyLine.payout}
// 					isSelected={selection.optionTwo}
// 					isEnabled={isEnabled}
// 					onPress={() => toggleBet("optionTwo")}
// 				/>
// 			</View>
// 			<Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
// 				{selection.optionOne && (
// 					<BetSelector
// 						closeSelection={() => toggleBet("optionOne")}
// 						minBet={minBet}
// 						maxBet={maxBet}
// 						payout={awayMoneyLine.payout}
// 						betId={currentBetId}
// 					/>
// 				)}
// 				{selection.optionTwo && (
// 					<BetSelector
// 						closeSelection={() => toggleBet("optionTwo")}
// 						minBet={minBet}
// 						maxBet={maxBet}
// 						payout={homeMoneyLine.payout}
// 						betId={currentBetId}
// 					/>
// 				)}
// 			</Animated.View>
// 		</View>
// 	);
// }

// const s = StyleSheet.create({
// 	optionsContainer: {
// 		flexDirection: "row",
// 		gap: 4,
// 		justifyContent: "space-between",
// 	},
// });

import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useBetStore } from "../../state/useBetStore";
import { BETTING_RULES } from "../../utils/betting-rules";
import { BetTypeHeading } from "./BetTypeHeading";
import { BetOption } from "./BetOption";
import { BetSelector } from "./BetSelector";
// import { BetTypeHeading } from "../BetTypeHeading";
// import { BetOption } from "../BetOption";
// import { BetSelector } from "../BetSelector";

function _MoneyLine({ moneyLineOptions = [], game }) {
  if (moneyLineOptions.length < 2) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // 1. Budget flag for moneyLine
  const isBudgetMaxed = useBetStore((s) => s.budgetStatus.moneyLine);

  // 2. Min/max bets from your rules
  const { minBet, maxBet } = BETTING_RULES.money_line;

  // 3. Our two options
  const awayOpt = moneyLineOptions[0];
  const homeOpt = moneyLineOptions[1];

  // 4. Subscribe to those two bets
  const awayBet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === awayOpt.id)
  );
  const homeBet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === homeOpt.id)
  );

  // 5. Open panel whenever either bet exists
  useEffect(() => {
    setIsOpen(!!awayBet || !!homeBet);
  }, [awayBet, homeBet]);

  // 6. Animate height 0↔54
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? 54 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  // 7. Which one is selected
  const selectedId = awayBet
    ? awayOpt.id
    : homeBet
    ? homeOpt.id
    : null;

  // 8. Toggling logic
  const store = useBetStore.getState();
  const toggle = (opt) => {
    if (selectedId === opt.id) {
      store.removeBet(opt.id);
    } else {
      if (selectedId) store.removeBet(selectedId);
      store.addBet({
        bet_amount: minBet,
        to_win_amount: Math.round(minBet * opt.payout),
        bet_option_id: opt.id,
        category: "money_line",
        title: opt.title,
        payout: opt.payout,
        game,
        addedAt: Date.now(),
        isNew: true,
      });
    }
  };

  return (
    <View>
      <BetTypeHeading heading="Money Line" />
      <View style={s.optionsContainer}>
        <BetOption
          title={awayOpt.title}
          payout={awayOpt.payout}
          isEnabled={!isBudgetMaxed}
          isSelected={selectedId === awayOpt.id}
          onPress={() => toggle(awayOpt)}
        />
        <BetOption
          title={homeOpt.title}
          payout={homeOpt.payout}
          isEnabled={!isBudgetMaxed}
          isSelected={selectedId === homeOpt.id}
          onPress={() => toggle(homeOpt)}
        />
      </View>

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
        {selectedId && (
          <BetSelector
            betOptionId={selectedId}
            closeSelection={() => store.removeBet(selectedId)}
          />
        )}
      </Animated.View>
    </View>
  );
};

export const MoneyLine = React.memo(_MoneyLine);

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  selectorWrapper: {
    overflow: "hidden",
  },
});