import { View, StyleSheet } from "react-native";
import { Txt } from "../../../components/general/Txt";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";

export default function GameDetails() {
  const { selectedGame, selectedGameData } = useScoreboard();

  return (
    // Macro Game Data
    <View style={s.container}>
      <View style={s.macroGameCard}>
        <ScoreboardGameCard
          game={selectedGame}
          sampleGameData={selectedGameData}
        />
      </View>

      <Txt>Box Score vs Bets Toggle</Txt>
      <Txt>{selectedGame.away_team.name} OR {selectedGame.home_team.name}</Txt>
      <Txt>Box Score Details</Txt>
      <Txt>Toggle Teams</Txt>
      <Txt>Team Stats</Txt>
      <Txt>Passing</Txt>
      <Txt>Rushing</Txt>
      <Txt>Receiving</Txt>

      <Txt></Txt>
      <Txt>Bet Details</Txt>
      <Txt>My Bets vs League Bets Toggle</Txt>
      <Txt>Betting information needs to be accessed here</Txt>
      
      <Txt>{selectedGameData.full_box.away_team.score}</Txt>
      
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    padding: 8,
    // alignItems: 'center'
  },
  macroGameCard: {
    backgroundColor: "#0F2638",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
});
