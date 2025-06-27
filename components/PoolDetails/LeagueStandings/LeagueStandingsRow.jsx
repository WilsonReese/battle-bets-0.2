import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";

export function LeagueStandingsRow({ entry, isLast }) {
  console.log('Standing Row:', entry.ranking)

  return (
    <>
      <View key={entry.id} style={[s.container, !isLast && s.withBottomBorder]}>
        <View style={s.rank}>
          <Txt style={s.txt}>{entry.ranking}</Txt>
        </View>
        <View style={s.player}>
          <Txt style={[s.txt, s.playerName]}>
            @{entry.user.username}
          </Txt>
        </View>
        <View style={s.score}>
          <Txt style={s.txt}>{entry.total_points}</Txt>
        </View>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  txt: {
    color: "#F8F8F8",
    fontSize: 14,
  },
  rank: {
    width: 60,
    // backgroundColor: "green",
    alignItems: "center",
  },
  player: {
    // backgroundColor: "blue",
    flex: 20,
    alignItems: "flex-start",
  },
  score: {
    width: 80,
    // backgroundColor: "red",
    alignItems: "center",
  },
  withBottomBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#3A454D",
  },
  playerName: {
    fontFamily: 'Saira_400Regular_Italic'
  }
});
