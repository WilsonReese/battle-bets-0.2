import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetOption } from "../BetOption";
import { BetSelector } from "../BetSelector";
import { useBetStore } from "../../../state/useBetStore";
import { BETTING_RULES } from "../../../utils/betting-rules";
import { Txt } from "../../general/Txt";
import { LinesUnavailable } from "../LinesUnavailable";
// import { BETTING_RULES } from "../../../utils/betting-rules";

function _OverUnder({ ouOptions, game }) {
  // if there aren’t exactly two OU options, bail
  if (!ouOptions || ouOptions.length < 2) {
    return (
      <>
        <BetTypeHeading heading={"Over/Under"} />
        <LinesUnavailable/>
      </>
    )
  }

  // 1) Which options?
  const overOpt = ouOptions[0];
  const underOpt = ouOptions[1];

  // 2) Local open/closed + animation
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // 3) Shared spread/OU budget
  const isBudgetMaxed = useBetStore((s) => s.budgetStatus.spreadOU);

  // 4) Min/max from our rules
  const { minBet, maxBet } = BETTING_RULES["ou"];

  // 5) Subscribe to just these two bets
  const overBet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === overOpt.id)
  );
  const underBet = useBetStore((s) =>
    s.bets.find((b) => b.bet_option_id === underOpt.id)
  );

  // 6) Open when either exists
  useEffect(() => {
    setIsOpen(!!overBet || !!underBet);
  }, [overBet, underBet]);

  // 7) Animate height
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? 54 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  // 8) Which option is currently selected?
  const selectedId = overBet
    ? overOpt.id
    : underBet
    ? underOpt.id
    : null;

  // 9) Toggling logic
  const store = useBetStore.getState();
  const toggle = (opt) => {
    if (selectedId === opt.id) {
      // close
      store.removeBet(opt.id);
    } else {
      // remove the old if it exists, then add new
      if (selectedId) store.removeBet(selectedId);
      store.addBet({
        bet_amount: minBet,
        to_win_amount: Math.round(minBet * opt.payout),
        bet_option_id: opt.id,
        category: "ou",
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
      <BetTypeHeading heading="Over/Under" />
      <View style={s.optionsContainer}>
        <BetOption
          title={overOpt.title}
          payout={overOpt.payout}
          isEnabled={!isBudgetMaxed}
          isSelected={selectedId === overOpt.id}
          onPress={() => toggle(overOpt)}
        />
        <BetOption
          title={underOpt.title}
          payout={underOpt.payout}
          isEnabled={!isBudgetMaxed}
          isSelected={selectedId === underOpt.id}
          onPress={() => toggle(underOpt)}
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

export const OverUnder = React.memo(_OverUnder);

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
