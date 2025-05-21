import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";
import { useStandings } from "../contexts/StandingsContext";
import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import { PreseasonPoolCard } from "./PreseasonPoolCard";

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
      <Txt style={s.heading}>{pool.name}</Txt>

      {/* League Season has not started, show PreseasonPoolCard */}
      {!pool.has_started && (
        <PreseasonPoolCard
          pool={pool} // Replace with real season object if available
        />
      )}

      {/* League Season has started */}
      {pool.has_started && (
        <View style={s.detailsContainer}>
          <View style={s.overviewContainer}>
            <View style={s.headingTxtContainer}>
              <Txt style={s.sectonHeadingTxt}>Overview</Txt>
            </View>
            <View style={s.infoContainer}>
              <View style={s.infoUnitContainer}>
                <Txt style={s.infoTitleTxt}>Points: </Txt>
                <Txt style={s.txt}>{userEntry?.total_points || "N/A"}</Txt>
              </View>
              <View style={s.infoUnitContainer}>
                <Txt style={s.infoTitleTxt}>Rank: </Txt>
                <Txt style={s.txt}>{userEntry?.ranking || "N/A"}</Txt>
              </View>
            </View>
            <View>
              <Btn
                btnText={`Go to ${pool.name}`}
                style={s.btn}
                isEnabled={true}
                fontSize={14}
                onPress={() => router.push(`/pools/${pool.id}/`)}
              />
            </View>
          </View>

          <View style={s.currentBattleContainer}>
            <View style={s.headingTxtContainer}>
              <Txt style={s.sectonHeadingTxt}>Current Battle</Txt>
            </View>
            <View style={s.infoContainer}>
              <Txt style={s.txt}>0/12 betslips submitted</Txt>
              <Txt style={s.txt}>Make bets before games start</Txt>
            </View>
            <View>
              <Btn
                btnText={`Go to ${pool.name}`}
                style={s.btn}
                isEnabled={true}
                fontSize={14}
                onPress={() => router.push(`/pools/${pool.id}/`)}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#DAE1E5",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  heading: {
    color: "#061826",
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
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },

  sectonHeadingTxt: {
    color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 14,
    textTransform: "uppercase",
  },

  txt: {
    color: "#061826",
    fontSize: 14,
  },

  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
