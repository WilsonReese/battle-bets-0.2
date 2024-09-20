import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";

export function Matchup({ homeTeam, homeRecord, awayTeam, awayRecord }) {
  return (
    <View style={s.matchup}>
      <View style={s.team}>
        <View style={s.icon}></View>
        <Txt style={s.teamName}>{awayTeam}</Txt>
        <Txt style={s.teamRecord}>({awayRecord})</Txt>
      </View>
      <View style={s.team}>
        <View style={s.icon}></View>
        <Txt style={s.teamName}>{homeTeam}</Txt>
        <Txt style={s.teamRecord}>({homeRecord})</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  matchup: {
    flexDirection: "row",
  },
  team: {
    flexDirection: "row",
    flex: 1,
    alignItems: 'center'
  },
  icon: {
    backgroundColor: "#5996FF",
    height: 22,
    width: 22,
    borderRadius: 15,
  },
  teamName: {
    paddingHorizontal: 8,
    fontFamily: "Saira_600SemiBold",
    fontSize: 16,
    color: "#061826"
  },
  teamRecord: {
    fontSize: 14,
    fontFamily: "Saira_300Light",
    color: "#061826"
  }
});
