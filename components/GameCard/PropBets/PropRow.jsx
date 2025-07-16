import React, { useState, useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { BetOption } from "../BetOption";
import { BetSelector } from "../BetSelector";
import { useBetStore } from "../../../state/useBetStore";
import { BETTING_RULES } from "../../../utils/betting-rules";

export default React.memo(function PropRow({ option, game }) {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // subscribe just to this prop bet
  const bet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === option.id)
  );

  // open/close driven by whether bet exists
  useEffect(() => {
    setIsOpen(!!bet);
  }, [bet]);

  // animate open/close
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? 54 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  // prop budget flag
  const isBudgetMaxed = useBetStore((s) => s.budgetStatus.prop);

  const { minBet, maxBet } = BETTING_RULES.prop;

  const store = useBetStore.getState();
  const toggle = () => {
    if (bet) {
      store.removeBet(option.id);
    } else {
      store.addBet({
        bet_amount: minBet,
        to_win_amount: Math.round(minBet * option.payout),
        bet_option_id: option.id,
        category: "prop",
        title: option.title,
        payout: option.payout,
        game,
        addedAt: Date.now(),
        isNew: true,
      });
    }
  };

  return (
    <View style={s.row}>
      <BetOption
        title={option.title}
        payout={option.payout}
        isEnabled={!isBudgetMaxed}
        isSelected={!!bet}
        onPress={toggle}
      />
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
        {bet && <BetSelector betOptionId={option.id} closeSelection={toggle} />}
      </Animated.View>
    </View>
  );
});

const s = StyleSheet.create({
  row: {
    // marginBottom: 8,
  },
  selectorWrapper: {
    overflow: "hidden",
    // marginTop: 4,
  },
});