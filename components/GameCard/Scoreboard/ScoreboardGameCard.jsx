import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Matchup } from "../Matchup/Matchup";
import { PregameCardDetails } from "./PregameCardDetails";
import sampleCompletedGame from "@/utils/sampleCompletedGame.json";

export function ScoreboardGameCard({ game }) {
  const sampleGame = sampleCompletedGame.data.NCAAFB[0];
  const homeAPI = sampleGame.full_box.home_team;
  const awayAPI = sampleGame.full_box.away_team;
  const statusAPI = sampleGame.full_box.current.Quarter

  
  const status = "postgame";

  return (
    <View>
      {/* Show the details for the pre-game of the card */}
      {status === "pregame" && (
        <View style={s.container}>
          <Matchup
            homeTeam={game.home_team.name}
            awayTeam={game.away_team.name}
            format={"scoreboard"}
          />
          <PregameCardDetails game={game} />
        </View>
      )}

      {status === "inProgress" && (
        <View style={s.container}>
          <Txt>{game.home_team.name}</Txt>
          <Txt>{game.away_team.name}</Txt>
        </View>
      )}

      {status === "postgame" && (
        <View style={s.container}>
          <Txt>{statusAPI}</Txt>
          <Txt>{game.home_team.name}</Txt>
          <Txt>{homeAPI.score}</Txt>
          <Txt>{game.away_team.name}</Txt>
          <Txt>{awayAPI.score}</Txt>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 4,
  },
});
