import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { useLiveGameDataForDate } from "../../hooks/useLiveGameData";

export function TeamData({ stats }) {

  return (
    <View>
      <Txt>Offense</Txt>
      <Txt>Total Yards: {stats.total_yards}</Txt>
      <Txt>Passing Yards: {stats.passing_yards}</Txt>
      <Txt>Rushing Yards: {stats.rushing_yards}</Txt>
      <Txt>First Downs: {stats.first_downs}</Txt>

      <Txt>Defense</Txt>
      <Txt>Sacks: {stats.sacks}</Txt>
      <Txt>Safeties: {stats.safeties}</Txt>
      <Txt>Turnovers: {stats.turnovers}</Txt>


      <Txt>Defensive Touchdowns: {stats.defense_touchdowns}</Txt>
    </View>
  );
}

const s = StyleSheet.create({

});
