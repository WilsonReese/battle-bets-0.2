import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";
import { useStandings } from "../contexts/StandingsContext";
import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import { PreseasonPoolCard } from "./PreseasonPoolCard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BattleUnlockedPoolCard } from "./BattleUnlockedPoolCard";

export function PoolCard({ pool }) {
  const { userLeaderboardEntries, fetchStandings } = useStandings();
  // const [hasStarted, setHasStarted] = useState(null);
  const [loading, setLoading] = useState(false);

  // Extract user's points and ranking
  const userEntry = userLeaderboardEntries[pool.id];

  // useEffect to check if the season hasStarted
  // useEffect(() => {
  //   const fetchSeason = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await api.get(`/pools/${pool.id}/league_seasons`);
  //       const season2024 = res.data.find((s) => s.season.year === 2024); // hard coded 2024
  //       setHasStarted(season2024?.["has_started?"]);
  //     } catch (e) {
  //       console.error("Error fetching league season for pool", pool.id, e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSeason();
  // }, [pool.id]);

  // useEffect to get standings
  useEffect(() => {
    fetchStandings(pool.id, 2024); // Hard code: Fetch 2024 season data on mount
  }, [pool.id]);

  if (loading) {
    return <ActivityIndicator size="small" color="#061826" />;
  }

  return (
    <View style={s.card}>
      <TouchableOpacity
        style={s.headingContainer}
        onPress={() => router.push(`/pools/${pool.id}/`)}
      >
        <Txt style={s.heading}>{pool.name}</Txt>
        <FontAwesome6 name="circle-right" size={18} color="#54D18C" />
      </TouchableOpacity>

      {/* League Season has not started, show PreseasonPoolCard */}
      {!pool.has_started && (
        <PreseasonPoolCard
          pool={pool} // Replace with real season object if available
        />
      )}

      {/* League Season has started */}
      {pool.has_started && (
        <BattleUnlockedPoolCard pool={pool} userEntry={userEntry}/>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#0F2638",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headingContainer: {
    flexDirection: "row",
    // backgroundColor: 'blue',
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    paddingVertical: 4,
    fontSize: 18,
  },
  detailsContainer: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  overviewContainer: {
    flex: 3,
    paddingRight: 4,
  },
  currentBattleContainer: {
    flex: 5,
    paddingLeft: 4,
  },

  infoContainer: {
    paddingVertical: 4,
  },

  infoUnitContainer: {
    flexDirection: "row",
  },

  infoTitleTxt: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },

  sectonHeadingTxt: {
    // color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 14,
    textTransform: "uppercase",
  },

  txt: {
    // color: "#061826",
    fontSize: 14,
  },

  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
