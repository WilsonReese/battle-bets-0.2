import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Txt } from "../general/Txt";
import { BetSelector } from "../GameCard/BetSelector";
import { BETTING_RULES } from "../../utils/betting-rules";

export function Bet({ bet, isSelectorVisible }) {
  const { minBet, maxBet } = BETTING_RULES.spread;
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isSelectorVisible ? 54 : 0, // Adjust the height as needed
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSelectorVisible]);

  return (
    <View style={s.container}>
      <View style={[
        s.betItem,
        isSelectorVisible && s.betItemEditMode
        ]}>
        <View style={s.betDetailsContainer}>
          <Txt style={s.betName}>{bet.name}: </Txt>
          <Txt style={s.betText}>
            ${bet.betAmount} to win ${bet.toWinAmount}
          </Txt>
        </View>
      </View>
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        {isSelectorVisible ?
          <BetSelector
            betId={bet.id}
            closeSelection={() => {}}
            minBet={minBet}
            maxBet={maxBet}
            payout={bet.toWinAmount / bet.betAmount}
          />
        : null}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  betItem: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  betItemEditMode: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#54D18C"
  },
  betDetailsContainer: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  betName: {
    fontSize: 14,
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
  betText: {
    fontSize: 14,
    color: "#061826",
  },
});
