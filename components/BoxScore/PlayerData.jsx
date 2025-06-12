import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { usePlayerStats } from "../../hooks/usePlayerStats"; // adjust import path

const STAT_GROUPS = [
  "passing",
  "rushing",
  "receiving",
  "kick_returns",
  "punt_returns",
  "kicking",
  "punting",
  "defensive",
];

const DISPLAY_STATS = {
  passing: {
    "comp att": "C/ATT",
    yards: "YDS",
    "passing touch downs": "TD",
    interceptions: "INT",
  },
  rushing: {
    "total rushes": "ATT",
    yards: "YDS",
    average: "AVG",
    "rushing touch downs": "TD",
  },
  receiving: {
    "total receptions": "REC",
    yards: "YDS",
    average: "AVG",
    "receiving touch downs": "TD",
  },
  kicking: { "field goals": "FG", long: "LONG", "extra point": "XP" },
  punting: { total: "NO", yards: "YDS", average: "AVG", touchbacks: "TB" },
  kick_returns: {
    total: "NO",
    yards: "YDS",
    average: "AVG",
    "kick return td": "TD",
  },
  punt_returns: {
    total: "NO",
    yards: "YDS",
    average: "AVG",
    td: "TD",
  },
  defensive: {
    tackles: "TOT",
    tfl: "TFL",
    sacks: "SACK",
    fr: "FR",
    int: "INT",
    td: "TD",
  },
};

const STAT_GROUP_LABELS = {
  defensive: "Defense",
  kick_returns: "Kick Returns",
  punt_returns: "Punt Returns",
};

export function PlayerData({ stats }) {
  const normalizedGroups = usePlayerStats(stats);

  const renderStatGroup = (groupName) => {
    const group = normalizedGroups[groupName];
    if (!group) {
      return (
        <Txt key={groupName}>No stats for {groupName.replace(/_/g, " ")}</Txt>
      );
    }

    const statLabelMap = DISPLAY_STATS[groupName];
    const statKeys = Object.keys(statLabelMap);

    return (
      <View key={groupName} style={s.statCategoryContainer}>
        {/* <Txt style={[s.statCategoryTitle, s.firstHeaderCell]}>{group.name}</Txt> */}

        {/* Header Row */}
        <View style={[s.row, s.headerRow]}>
          {/* <Txt style={[s.cell, s.firstHeaderCell]}>Player</Txt> */}
          <Txt style={[s.statCategoryTitle, s.firstColumnCell]}>
            {STAT_GROUP_LABELS[groupName] || group.name}
          </Txt>
          {statKeys.map((key) => (
            <Txt key={key} style={[s.cell, s.headerCell]}>
              {statLabelMap[key]}
            </Txt>
          ))}
        </View>

        {/* Player Rows */}
        {group.players.map((player) => {
          const [firstName, ...rest] = player.player.name.split(" ");
          const lastName = rest.join(" ");

          return (
            <View key={player.player.id} style={s.row}>
              <View style={[s.firstColumnCell, s.playerNameContainer]}>
                <Txt style={s.firstName}>{firstName}</Txt>
                <Txt style={s.lastName}>{lastName}</Txt>
              </View>
              {statKeys.map((key) => {
                const stat = player.statistics.find((s) => s.name === key);
                return (
                  <Txt key={key} style={s.cell}>
                    {stat?.value ?? "—"}
                  </Txt>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  return <View>{STAT_GROUPS.map(renderStatGroup)}</View>;
}

const s = StyleSheet.create({
  statCategoryContainer: {
    backgroundColor: "#0F2638",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingBottom: 4,
    marginVertical: 8,
  },
  statCategoryTitle: {
    fontSize: 16,
    fontFamily: 'Saira_600SemiBold',
    paddingVertical: 4,
    color: "#54D18C",
  },
  row: {
    flexDirection: "row",
    alignItems: 'center',
    paddingVertical: 1,
  },
  headerRow: {
    borderBottomWidth: 0.5,
    borderColor: "#425C70",
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 0,
    marginBottom: 4,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: "#C7CDD1",
    textAlign: "center",
  },
  firstColumnCell: {
    flex: 3.5,
    minWidth: 20,
  },
  playerNameContainer: {
    // paddingLeft: 4,
  },
  firstName: {
    fontSize: 9,
    fontWeight: "500",
    color: "#C7CDD1",
    marginBottom: -6,
    textTransform: "uppercase",
  },
  lastName: {
    fontSize: 14,
    color: "#F8F8F8",
    fontFamily: 'Saira_600SemiBold',
    // textTransform: "uppercase",
  },
  headerCell: {
    color: "#F8F8F8",
    flex: 1,
    // fontFamily: 'Saira_400Regular',
    fontFamily: 'Saira_600SemiBold',
    fontSize: 12,
  },
});
