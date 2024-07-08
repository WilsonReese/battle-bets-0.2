import { StyleSheet, View } from "react-native";
import { Datetime } from "./Datetime/Datetime";
import { Matchup } from "./Matchup/Matchup";
import { BetOptions } from "./BetOptions";
import { Txt } from "../general/Txt";
import { useState } from "react";
import { useBetContext } from "../contexts/BetContext";

export function GameCard({ game }) {
  const {
    ou,
    ouPayout,
    spreadHome,
    spreadAway,
    spreadPayout,
    moneyLineHome,
    moneyLineHomePayout,
    moneyLineAway,
    moneyLineAwayPayout,
  } = game;

  // const { betType } = useBetContext(); // Use the context

  return (
    // Game Card
    <View style={s.card}>
      <View style={s.gameDetails}>
        <Datetime date={game.date} time={game.time} />
        <Txt style={{ fontSize: 12, color: "black" }}>Collapisble Arrow</Txt>
      </View>
      <View>
        <Matchup
          homeTeam={game.homeTeam}
          homeRecord={game.homeRecord}
          awayTeam={game.awayTeam}
          awayRecord={game.awayRecord}
        />
        <BetOptions
          game={game}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#DAE1E5",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gameDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
