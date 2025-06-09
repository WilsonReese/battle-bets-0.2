import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Matchup } from "../Matchup/Matchup";
import { PregameCardDetails } from "./PregameCardDetails";

export function ScoreboardGameCard({ game }) {
  const status = "pregame";

  return (
    <View>
      {/* Show the details for the pre-game of the card */}
      {status === "pregame" && (
        <View style={{paddingBottom: 4}}>
          <PregameCardDetails game={game}/>
          <Matchup
            homeTeam={game.home_team.name}
            awayTeam={game.away_team.name}
          />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingBottom: 4,
  }
});
