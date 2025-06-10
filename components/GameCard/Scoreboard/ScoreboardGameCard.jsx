import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Matchup } from "../Matchup/Matchup";
import { PregameCardDetails } from "./PregameCardDetails";
import sampleCompletedGame from "@/utils/sampleCompletedGame.json";
import { BoxScoreGameCard } from "./BoxScoreGameCard";

export function ScoreboardGameCard({ game, sampleGameData }) {
  // const sampleGameData = sampleCompletedGame.data.NCAAFB[0];
  const status = "inProgress";

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
          <BoxScoreGameCard game={game} sampleGameData={sampleGameData} status={'inProgress'}/>
        </View>
      )}

      {status === "postgame" && (
        <View style={s.container}>
          <BoxScoreGameCard game={game} sampleGameData={sampleGameData} status={sampleGameData.status}/>
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
