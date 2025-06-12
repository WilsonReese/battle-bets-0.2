import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

export function TeamData({ stats }) {

  return (
    <View style={s.container}>
      <Txt>Offense</Txt>
      <Txt>Total Yards: {stats.yards.total}</Txt>
      <Txt>Passing Yards: {stats.passing.total}</Txt>
      <Txt>Rushing Yards: {stats.rushings.total}</Txt>

      <Txt>Turnovers: {stats.turnovers.total}</Txt>
      <Txt>Interceptions Thrown: {stats.turnovers.lost_fumbles}</Txt>
      <Txt>Fumbles Lost: {stats.turnovers.interceptions}</Txt>
      <Txt>Time of Possession: {stats.posession.total}</Txt>

      <Txt>First Downs: {stats.first_downs.total}</Txt>
      <Txt>Third Down Efficiency: {stats.first_downs.third_down_efficiency}</Txt>
      <Txt>Fourth Down Efficiency: {stats.first_downs.fourth_down_efficiency}</Txt>

      <Txt>Defense</Txt>
      <Txt>Sacks: {stats.sacks.total}</Txt>
      <Txt>Safeties: {stats.safeties.total}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#1D394E',
    borderRadius: 8,
    paddingVertical: 4, 
    paddingHorizontal: 8, 
  },
});
