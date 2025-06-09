import { StyleSheet, View } from "react-native";
import { Datetime } from "./Datetime/Datetime";
import { Matchup } from "./Matchup/Matchup";
import { BetOptions } from "./BetOptions";
import { Txt } from "../general/Txt";
import { ScoreboardGameCard } from "./Scoreboard/ScoreboardGameCard";

export function GameCard({ game, type }) {
  return (
    // Game Card
    <View style={s.card}>
      <View style={{ height: 4 }} />
      {type === "betSelection" && (
        <View>
          <Matchup
            homeTeam={game.home_team.name}
            awayTeam={game.away_team.name}
          />
          <BetOptions game={game} />
        </View>
      )}
      {type === "scoreboard" && <ScoreboardGameCard game={game}/>}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#0F2638",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gameDetails: {
    flexDirection: "row",
    justifyContent: "flex",
  },
});
