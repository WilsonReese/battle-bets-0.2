import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

function parseTimeToSeconds(timeStr) {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
}

function parseEfficiency(efficiencyStr) {
  const [made, attempts] = efficiencyStr.split("-").map(Number);
  if (!attempts || attempts === 0) return 0; // avoid divide-by-zero
  return made / attempts;
}

export function TeamData({
  awayStats,
  homeStats,
  selectedTeam,
  awayTeamName,
  homeTeamName,
}) {
  const isAwaySelected = selectedTeam && selectedTeam === awayTeamName;
  const awayStyle = isAwaySelected ? s.selectedPortion : s.unselectedPortion;
  const homeStyle = !isAwaySelected ? s.selectedPortion : s.unselectedPortion;

  function calculateFlexValues(away, home) {
    const total = away + home;
    if (total === 0) return [0.5, 0.5];
    return [away / total, home / total];
  }

  const STAT_ROWS = [
    {
      label: "Total Yards",
      awayValue: (stats) => stats.yards.total,
      homeValue: (stats) => stats.yards.total,
    },
    {
      label: "Passing Yards",
      awayValue: (stats) => stats.passing.total,
      homeValue: (stats) => stats.passing.total,
    },
    {
      label: "Rushing Yards",
      awayValue: (stats) => stats.rushings.total,
      homeValue: (stats) => stats.rushings.total,
    },
    {
      label: "Time of Possession",
      awayValue: (stats) => parseTimeToSeconds(stats.posession.total),
      homeValue: (stats) => parseTimeToSeconds(stats.posession.total),
      displayAway: (stats) => stats.posession.total,
      displayHome: (stats) => stats.posession.total,
    },
    {
      label: "First Downs",
      awayValue: (stats) => stats.first_downs.total,
      homeValue: (stats) => stats.first_downs.total,
    },
    {
      label: "Third Down Efficiency",
      awayValue: (stats) =>
        parseEfficiency(stats.first_downs.third_down_efficiency),
      homeValue: (stats) =>
        parseEfficiency(stats.first_downs.third_down_efficiency),
      displayAway: (stats) => stats.first_downs.third_down_efficiency,
      displayHome: (stats) => stats.first_downs.third_down_efficiency,
    },
    {
      label: "Fourth Down Efficiency",
      awayValue: (stats) =>
        parseEfficiency(stats.first_downs.fourth_down_efficiency),
      homeValue: (stats) =>
        parseEfficiency(stats.first_downs.fourth_down_efficiency),
      displayAway: (stats) => stats.first_downs.fourth_down_efficiency,
      displayHome: (stats) => stats.first_downs.fourth_down_efficiency,
    },
    {
      label: "Turnovers",
      awayValue: (stats) => stats.turnovers.total,
      homeValue: (stats) => stats.turnovers.total,
      reverse: true,
    },
    {
      label: "Sacks",
      awayValue: (stats) => stats.sacks.total,
      homeValue: (stats) => stats.sacks.total,
    },
    {
      label: "Safeties",
      awayValue: (stats) => stats.safeties.total,
      homeValue: (stats) => stats.safeties.total,
    },
  ];

  return (
    <View style={s.container}>
      <Txt style={s.statSectionTitle}>Team Stats</Txt>
      {STAT_ROWS.map(
        ({
          label,
          awayValue,
          homeValue,
          displayAway,
          displayHome,
          reverse,
        }) => {
          let away = awayValue(awayStats);
          let home = homeValue(homeStats);

          if (reverse) {
            // Invert values so fewer turnovers shows larger bar
            const total = away + home;
            away = total - away;
            home = total - home;
          }

          const [awayFlex, homeFlex] = calculateFlexValues(away, home);

          const awayText = displayAway
            ? displayAway(awayStats)
            : awayValue(awayStats);
          const homeText = displayHome
            ? displayHome(homeStats)
            : homeValue(homeStats);

          return (
            <View key={label} style={s.statSection}>
              <View style={s.statValuesRow}>
                <Txt style={s.statValueTxt}>{awayText}</Txt>
                <Txt style={s.statLabelTxt}>{label}</Txt>
                <Txt style={s.statValueTxt}>{homeText}</Txt>
              </View>
              <View
                style={[
                  s.bar,
                  (away === 0 && home != 0) || (away != 0 && home === 0)
                    ? s.noGap
                    : s.withGap,
                ]}
              >
                <View style={[s.awayPortion, awayStyle, { flex: awayFlex }]} />
                <View style={[s.homePortion, homeStyle, { flex: homeFlex }]} />
              </View>
            </View>
          );
        }
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#0F2638",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  statSection: {
    paddingVertical: 4,
  },
  statSectionTitle: {
    fontSize: 16,
    fontFamily: "Saira_600SemiBold",
    // paddingVertical: 4,
    // color: "#54D18C",
  },
  bar: {
    height: 8,
    flex: 1,
    borderRadius: 50,
    flexDirection: "row",
  },
  withGap: {
    gap: 4,
  },
  noGap: {
    gap: 0,
  },
  awayPortion: {
    borderRadius: 50,
  },
  homePortion: {
    borderRadius: 50,
  },
  selectedPortion: {
    backgroundColor: "#54D18C",
  },
  unselectedPortion: {
    backgroundColor: "#C7CDD1",
  },
  statValuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 2,
  },
  statLabelTxt: {
    fontSize: 14,
    fontFamily: "Saira_600SemiBold",
  },
  statValueTxt: {
    fontSize: 14,
    color: "#C7CDD1",
    paddingHorizontal: 4,
  },
});
