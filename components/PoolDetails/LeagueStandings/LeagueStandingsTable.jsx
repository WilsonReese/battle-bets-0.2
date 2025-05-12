import { FlatList, StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { useStandings } from "../../contexts/StandingsContext";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

export function LeagueStandingsTable({ leagueSeason, poolId }) {
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
      <ScrollView>
        {leaderboardEntries.map((entry, index) => (
          <View key={entry.id} style={s.row}>
            {console.log(entry.user.first_name)}
            <Txt style={s.position}>{index + 1}.</Txt>
            <Txt style={s.position}>{entry.ranking}</Txt>
            <Txt style={s.name}>{entry.user.first_name} {entry.user.last_name}</Txt>
            <Txt style={s.points}>${entry.total_points.toFixed(2)}</Txt>
          </View>
        ))}
      </ScrollView>
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
  score: {
    width: 80,
    textAlign: "right",
    color: "#54D18C",
    fontWeight: "600",
  },
});
