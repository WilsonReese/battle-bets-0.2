import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { BetSelector } from "../GameCard/BetSelector";
import { BETTING_RULES } from "../../utils/betting-rules";
import { useState } from "react";

export function Bet({ bet, isSelectorVisible }) {
  const { minBet, maxBet } = BETTING_RULES.spread;

  return (
    <View style={s.container}>
      <View style={s.betItem}>
        <View style={s.betDetailsContainer}>
          <Txt style={s.betName}>{bet.name}: </Txt>
          <Txt style={s.betText}>
            ${bet.betAmount} to win ${bet.toWinAmount}
          </Txt>
        </View>
        {/* <SmallBtn isEnabled={true} text={"Edit"} /> */}
      </View>
      {isSelectorVisible ? 
        <BetSelector
          betId={bet.id}
          closeSelection={() => {}}
          minBet={minBet}
          maxBet={maxBet}
          payout={bet.toWinAmount/bet.betAmount}
        />
      : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  betItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  betDetailsContainer: {
    flexDirection: "row",
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
