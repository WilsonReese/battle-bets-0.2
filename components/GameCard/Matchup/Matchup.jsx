import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { TeamLogo } from "./TeamLogo";

export function Matchup({ homeTeam, awayTeam, format = 'betSelection' }) {
  return (
    // Either shows the bet selection matchup or the scoreboard matchup
    <View style={format === 'betSelection' ? s.matchupBetSelection : s.matchupScoreboard}>
      <View style={s.team}>
        <TeamLogo teamName={awayTeam} size={32}/>
        <Txt style={s.teamName}>{awayTeam}</Txt>
      </View>
      <View style={s.team}>
        <TeamLogo teamName={homeTeam} size={32}/>
        <Txt style={s.teamName}>{homeTeam}</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  matchupBetSelection: {
    flexDirection: "row",
  },
  matchupScoreboard: {
    gap: 4,
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
    // color: "#061826"
  },
  teamRecord: {
    fontSize: 14,
    fontFamily: "Saira_300Light",
    // color: "#061826"
  }
});
