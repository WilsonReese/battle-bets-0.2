import {
  View,
  StyleSheet,
} from "react-native";
import { Txt } from "../../../components/general/Txt";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";


export default function GameDetails() {
  const { selectedGame, selectedGameData } = useScoreboard();

  return (
    <View style={s.container}>
      <Txt>Box Score Screen</Txt>
      <Txt>{selectedGameData.full_box.away_team.score}</Txt>
      <Txt>{selectedGame.home_team.name}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
  }
});
