import { StyleSheet, View } from "react-native";
import { Datetime } from "./Datetime/Datetime";
import { Matchup } from "./Matchup/Matchup";
import { BetOptions } from "./BetOptions";
import { Txt } from "../general/Txt";

export function GameCard({ game }) {
  
  return (
    // Game Card
    <View style={s.card}>
      <View style={s.gameDetails}>
        <View style={{height: 4}}/>
        {/* <Datetime date={game.start_time} time={game.time} /> */}
        {/* <Txt style={{ fontSize: 12, color: "black" }}>Collapisble Arrow</Txt> */}
      </View>
      <View>
        <Matchup
          homeTeam={game.home_team.name}
          homeRecord={game.homeRecord}
          awayTeam={game.away_team.name}
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
    justifyContent: "flex",
  },
});
