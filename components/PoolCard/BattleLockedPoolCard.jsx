import { StyleSheet, View, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Txt } from "../general/Txt";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useBattleLeaderboard } from "../../hooks/useBattleLeaderboard";
import { getOrdinalSuffix } from "../../utils/formatting";
import { usePoolDetails } from "../contexts/PoolDetailsContext";
import { format } from "date-fns";
import { router } from "expo-router";

export function BattleLockedPoolCard({ userEntry, userBetslip, pool, battle }) {
  const { betslips } = useBattleLeaderboard(
    pool.id,
    battle.league_season_id,
    battle.id
  );

  const { selectedSeason } = usePoolDetails(pool.id);

  const userRankedBetslip = betslips.find((b) => b.id === userBetslip.id);
  const battleEndDate = format(new Date(battle.end_date), "MMMM d");

  return (
    <View style={s.detailsContainer}>
      <View style={s.overviewContainer}>
        <Txt style={s.sectonHeadingTxt}>Season</Txt>
        <View style={s.infoContainer}>
          <View style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>Rank:</Txt>
            <Txt style={s.txt}>{userEntry?.ranking || "N/A"}</Txt>
          </View>
          <View style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>Points:</Txt>
            <Txt style={s.txt}>{userEntry?.total_points || "N/A"}</Txt>
          </View>
        </View>
      </View>

      <View style={s.currentBattleContainer}>
        <Txt style={s.sectonHeadingTxt}>This Week</Txt>
        <TouchableOpacity
          style={s.betslipTouchable}
          onPress={() =>
            router.push({
              pathname: `/pools/${pool.id}/battles/${battle.id}/battleLeaderboard`,
              params: {
                leagueSeasonId: selectedSeason.id,
                poolName: pool.name,
                battleEndDate: battleEndDate,
              },
            })
          }
        >
          <View style={s.infoContainer}>
            <View style={s.infoUnitContainer}>
              {/* <Txt style={s.txt}>Rank: {userRankedBetslip?.rank ?? "—"}</Txt> */}
              <Txt style={s.txt}>
                {getOrdinalSuffix(userRankedBetslip?.rank ?? "—")} Place
              </Txt>
              {/* <MaterialCommunityIcons name="podium" size={14} color="#54D18C" /> */}
            </View>
            <View style={s.infoUnitContainer}>
              <Txt style={s.txt}>Won: ${userBetslip.earnings}</Txt>
              <Txt style={s.txt}>Max: ${userBetslip.max_payout_remaining}</Txt>
            </View>
          </View>
          <FontAwesome6 name="circle-chevron-right" size={14} color="#54D18C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  detailsContainer: {
    flexDirection: "row",
    paddingBottom: 4,
    gap: 8,
  },
  overviewContainer: {
    flex: 1,
  },
  currentBattleContainer: {
    flex: 2,
  },
  infoContainer: {
    paddingVertical: 4,
  },

  infoUnitContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },

  infoTitleTxt: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },

  sectonHeadingTxt: {
    // color: "#061826",
    // fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 12,
    textTransform: "uppercase",
    color: "#B8C3CC",
  },
  txt: {
    fontSize: 14,
  },
  betslipTouchable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
