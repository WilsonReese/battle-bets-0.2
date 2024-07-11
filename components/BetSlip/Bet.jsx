import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Txt } from "../general/Txt";
import { BetSelector } from "../GameCard/BetSelector";
import { BETTING_RULES } from "../../utils/betting-rules";
import { useBetContext } from "../contexts/BetContext";

export function Bet({ bet, isSelectorVisible, backgroundColor }) {
  const { minBet, maxBet } = BETTING_RULES.spread;
  const { removeBet } = useBetContext();
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isSelectorVisible ? 54 : 0, // Adjust the height as needed
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSelectorVisible]);

  return (
    <View style={[s.container]}>
      <View style={[s.betItem, {backgroundColor}, isSelectorVisible && s.betItemEditMode]}>
        <View style={s.betDetailsContainer}>
          <View style={s.betNameContainer}>
            <Txt style={s.betNameText}>{bet.name}: </Txt>
          </View>
          <View style={s.betAmountContainer}>
            <Txt style={s.betAmountText}>
              ${bet.betAmount} to win ${bet.toWinAmount}
            </Txt>
          </View>
        </View>
      </View>
      <Animated.View style={[s.betSelectorContainer, { height: animatedHeight, overflow: "hidden" }]}>
        {isSelectorVisible ? (
          <BetSelector
            betId={bet.id}
            closeSelection={() => {
              removeBet(bet.id);
            }}
            minBet={minBet}
            maxBet={maxBet}
            payout={bet.toWinAmount / bet.betAmount}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  betItem: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 2,
    // borderWidth: 1,
  },
  betItemEditMode: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#54D18C",
  },
  betDetailsContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  betNameContainer: {
    flex: 3,
    // backgroundColor: 'green'
  },
  betNameText: {
    fontSize: 14,
    // fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
  betAmountContainer: {
    flex: 2,
    alignItems: 'flex-end'
    // backgroundColor: 'blue'
  },
  betAmountText: {
    fontSize: 14,
    // fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
  betSelectorContainer: {
    marginBottom: 4,
  },
});
