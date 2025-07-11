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