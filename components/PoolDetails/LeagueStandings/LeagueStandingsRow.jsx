import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";

export function LeagueStandingsRow({ entry, key }) {
  return (
    <>
      <View key={key} style={s.container}>
        <Txt style={s.position}>{entry.ranking}</Txt>
        <Txt style={s.name}>
          {entry.user.first_name} {entry.user.last_name}
        </Txt>
        <Txt style={s.points}>${entry.total_points.toFixed(2)}</Txt>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  position: {
    // width: 30,
    fontWeight: "bold",
    color: "#F8F8F8",
    backgroundColor: 'green'
  },
  name: {
    // flex: 1,
    color: "#F8F8F8",
    backgroundColor: 'blue'
  },
  points: {
    // width: 80,
    textAlign: "right",
    color: "#54D18C",
    fontWeight: "600",
    backgroundColor: 'red'
  },
});
