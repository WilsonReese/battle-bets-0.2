import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { BetSelector } from "../GameCard/BetSelector";
import { BETTING_RULES } from "../../utils/betting-rules";
import { useBetOps, useBets } from "../contexts/BetContext";
import { BetDetails } from "./BetDetails";
import { format } from "date-fns";
import { BetAmount } from "./BetAmount";

export function Bet({ bet, backgroundColor }) {
  const { minBet, maxBet } = BETTING_RULES[bet.betType];
  const { openBetSelectorIds } = useBets();
  const { removeBet, toggleBetSelector } = useBetOps(); 

  const isBetSelectorOpen = openBetSelectorIds.has(bet.id);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const matchup = `${bet.game.away_team.name} at ${bet.game.home_team.name}`;
  const gameTime = format(new Date(bet.game.start_time), "h:mm a"); // Format time

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isBetSelectorOpen ? 54 : 0, // Adjust the height as needed
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isBetSelectorOpen]);

  return (
    <View style={[s.container]}>
      <TouchableOpacity
        style={[
          s.betItem,
          { backgroundColor },
          isBetSelectorOpen && s.betItemEditMode,
        ]}
        onPress={() => toggleBetSelector(bet.id)}
      >
        <View style={s.betDetailsContainer}>
          <View style={s.betNameContainer}>
            {/* <Txt style={s.betNameText}>{bet.name}</Txt> */}
            <BetDetails
              name={bet.shortTitle}
              multiplier={bet.payout}
              matchup={matchup}
              time={gameTime}
              betNameColor={"#F8F8F8"}
            />
          </View>
          <View style={s.betAmountContainer}>
            <BetAmount
              betAmount={bet.betAmount}
              toWinAmount={bet.toWinAmount}
            />
          </View>
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          s.betSelectorContainer,
          {
            height: animatedHeight,
            overflow: "hidden",
            opacity: animatedHeight.interpolate({
              inputRange: [0, 54],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <BetSelector
          betId={bet.id}
          closeSelection={() => {
            removeBet(bet.id);
          }}
          minBet={minBet}
          maxBet={maxBet}
          payout={bet.toWinAmount / bet.betAmount}
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    // borderBottomWidth: .5,
    borderColor: "#0F2638",
    paddingVertical: 4,
  },
  betItem: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 2,
    // borderWidth: .5,
    borderRadius: 8,
  },
  betItemEditMode: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // backgroundColor: "#54D18C",
    // borderWidth: .5,
    // borderColor: '#54D18C'
  },
  betDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'orange'
    // justifyContent: "space-between",
  },
  betNameContainer: {
    flex: 3,
    // paddingRight: 20,
    // marginRight: 20,
    // backgroundColor: 'green'
  },
  betAmountContainer: {
    flex: 2,
    alignItems: "flex-end",
    // backgroundColor: 'blue'
  },
  betSelectorContainer: {
    marginBottom: 4,
  },
});
