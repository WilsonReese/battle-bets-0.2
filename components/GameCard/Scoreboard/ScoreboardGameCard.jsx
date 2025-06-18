import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Matchup } from "../Matchup/Matchup";
import { PregameCardDetails } from "./PregameCardDetails";
import sampleCompletedGame from "@/utils/sampleCompletedGame.json";
import { BoxScoreGameCard } from "./BoxScoreGameCard";
import { useScoreboard } from "../../contexts/ScoreboardContext";

export function ScoreboardGameCard({ game, sampleGameData, status, userBets }) {
  const { gameStatus } = useScoreboard();

  return (
    <View>
      {/* Show the details for the pre-game of the card */}
      {gameStatus === "pregame" && (
        <View style={s.container}>
          <Matchup
            homeTeam={game.home_team.name}
            awayTeam={game.away_team.name}
            format={"scoreboard"}
          />
          <PregameCardDetails game={game} />
        </View>
      )}

      {gameStatus === "inProgress" && (
        <View style={s.container}>
          <BoxScoreGameCard
            game={game}
            sampleGameData={sampleGameData}
            status={"inProgress"}
          />
        </View>
      )}

      {gameStatus === "postgame" && (
        <View style={s.container}>
          <BoxScoreGameCard
            game={game}
            sampleGameData={sampleGameData}
            status={sampleGameData.game.status.long}
          />
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
