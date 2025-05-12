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
  console.log(leaderboardEntries);

  return (
    <>
      <View>
        <Txt>Standings for {leagueSeason?.season?.year}</Txt>
      </View>
      <PaginatedFlatList
          data={leaderboardEntries}
          itemsPerPage={10}
          containerWidth={containerWidth}
          renderItemRow={(entry) => (
            <LeagueStandingsRow key={entry.id} entry={entry} />
          )}
        />
    </>
  );
}

const s = StyleSheet.create({
  title: {
    fontSize: 20,
    color: "#F8F8F8",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  position: {
    width: 30,
    fontWeight: "bold",
    color: "#F8F8F8",
  },
  name: {
    flex: 1,
    color: "#F8F8F8",
  },
  points: {
    width: 80,
    textAlign: "right",
    color: "#54D18C",
    fontWeight: "600",
  },
});
