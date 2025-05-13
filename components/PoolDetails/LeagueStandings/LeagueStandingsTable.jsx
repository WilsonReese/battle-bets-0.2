import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { useStandings } from "../../contexts/StandingsContext";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { LeagueStandingsRow } from "./LeagueStandingsRow";
import { PaginatedFlatList } from "../../general/PaginatedFlatList";

export function LeagueStandingsTable({ leagueSeason, poolId, containerWidth }) {
  const { standings, fetchStandings, loading } = useStandings();

  useEffect(() => {
    if (leagueSeason && poolId) {
      fetchStandings(poolId, leagueSeason.season.year);
    }
  }, [leagueSeason, poolId]);

  const leaderboardEntries = standings[poolId]?.entries || [];

  return (
    <>
      <View>
        <Txt style={s.title}>Standings</Txt>
      </View>
      <View style={s.headerContainer}>
        <View style={s.rankHeader}>
          <Txt style={s.headerTxt}>Rank</Txt>
        </View>
        <View style={s.playerHeader}>
          <Txt style={s.headerTxt}>Player</Txt>
        </View>
        <View style={s.scoreHeader}>
          <Txt style={s.headerTxt}>Score</Txt>
        </View>
        <View style={s.headerElement} />
      </View>
      <PaginatedFlatList
        data={leaderboardEntries}
        itemsPerPage={15}
        containerWidth={containerWidth}
        renderItemRow={(entry, index, total) => (
          <LeagueStandingsRow
            key={entry.id}
            entry={entry}
            isLast={index === total - 1}
          />
        )}
      />
    </>
  );
}

const s = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#F8F8F8",
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: .5,
    borderColor: "#3A454D",
  },
  rankHeader: {
    width: 60,
    alignItems: 'center',
  },
  playerHeader: {
    flex: 20,
  },
  scoreHeader: {
    width: 80,
    alignItems: "center",
  },
  headerTxt: {
    color: "#F8F8F8",
    fontSize: 12
  },
});
