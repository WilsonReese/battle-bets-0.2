import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";
import { StatusIcon } from "../general/StatusIcon";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useBetContext } from "../contexts/BetContext";
import { useBattleLeaderboard } from "../../hooks/useBattleLeaderboard";
import { getOrdinalSuffix } from "../../utils/formatting";

export function LockedBattleCard({
  battle,
  handleEditBets,
  battleEndDateTime,
  userBetslip,
  poolId,
}) {
  const { betslips } = useBattleLeaderboard(
    poolId,
    battle.league_season_id,
    battle.id
  );
  const topThree = betslips.slice(0, 3);

  const { getBudgetForBattle } = useBetContext();
  const remaining = getBudgetForBattle(battle.id);
  const userRankedBetslip = betslips.find((b) => b.id === userBetslip.id);

  console.log("User Betslip", userBetslip);
  console.log("Remaining Budget", remaining);
  console.log("Betslips", betslips);
  return (
    <View style={s.container}>
      {/* Leaderboard section */}
      <View style={s.leaderboardContainer}>
        <Txt style={s.headingTxt}>Leaderboard</Txt>
        <View style={s.leaderboardHeaderRow}>
          <Txt style={[s.headerRowTxt, s.placeColumn]}> </Txt>
          <Txt style={[s.headerRowTxt, s.playerColumn]}>Player</Txt>
          <Txt style={[s.headerRowTxt, s.column]}>Won</Txt>
          <Txt style={[s.headerRowTxt, s.column]}>Max</Txt>
        </View>
        {topThree.map((b, index) => {
          const prev = topThree[index - 1];
          const shouldShowRank = !prev || b.rank !== prev.rank;

          return (
            <View key={b.id} style={s.leaderboardRow}>
              <Txt style={[s.placeTxt, s.placeColumn]}>
                {shouldShowRank ? b.rank : ""}
              </Txt>
              <Txt style={[s.playerTxt, s.playerColumn]}>@{b.name}</Txt>
              <Txt style={[s.placeTxt, s.column]}>${b.earnings}</Txt>
              <Txt style={[s.placeTxt, s.column]}>
                ${b.max_payout_remaining}
              </Txt>
            </View>
          );
        })}
      </View>

      {/* Betslip Section */}
      <View style={s.betslipContainer}>
        <Txt style={s.headingTxt}>My Betslip</Txt>
        <View style={s.bottomSection}>
          <View style={s.betDetailsContainer}>
            <View>
              <Txt style={s.betInfoTxt}>
                {getOrdinalSuffix(userRankedBetslip?.rank ?? "—")} Place
              </Txt>
              <Txt style={s.betInfoTxt}>
                Hit Rate:{" "}
                {userRankedBetslip?.hitRate != null
                  ? `${userRankedBetslip.hitRate}%`
                  : "—"}
              </Txt>
            </View>
            <View>
              <Txt style={s.betInfoTxt}>
                Won:{" "}
                {userRankedBetslip?.earnings != null
                  ? `$${userRankedBetslip.earnings}`
                  : "—"}
              </Txt>
              <Txt style={s.betInfoTxt}>
                Max:{" "}
                {userRankedBetslip?.max_payout_remaining != null
                  ? `$${userRankedBetslip.max_payout_remaining}`
                  : "—"}
              </Txt>
            </View>
          </View>
          {/* Arrow Icon */}
          <View style={s.arrowIcon}>
            <FontAwesome6 name="circle-right" size={18} color="#54D18C" />
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    paddingTop: 8,
    gap: 10,
  },
  headingTxt: {
    // color: "#061826",
    // fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 10,
    textTransform: "uppercase",
    color: "#B8C3CC",
    paddingBottom: 2,
    // paddingTop: 8,
    // alignSelf: "center",
  },

  // Leaderboard Table Styling
  leaderboardContainer: {
    flex: 3,
    // backgroundColor: 'red',
    // paddingRight: 12,
  },
  leaderboardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#284357",
    // gap: 8,
  },
  headerRowTxt: {
    fontSize: 12,
    fontFamily: "Saira_600SemiBold",
  },
  column: {
    flex: 1.5,
    textAlign: "center",
    // justifyContent: 'center'
  },
  placeColumn: {
    flex: 0.5,
    textAlign: "center",
    // paddingRight: 20,
  },
  playerColumn: {
    flex: 3.5,
  },
  leaderboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // borderRightWidth: 0.5,
    // borderColor: "#284357",
  },
  placeTxt: {
    // width: 40,
    fontSize: 12,
  },
  playerTxt: {
    // flex: 1,
    fontSize: 12,
    fontFamily: "Saira_400Regular_Italic",
  },

  // Betslip Styling
  betslipContainer: {
    flex: 1.1,
    // backgroundColor: 'blue',
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  betDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    // backgroundColor: 'pink'
  },
  betInfoTxt: {
    // fontFamily: "Saira_600SemiBold",
    fontSize: 12,
  },
  dollarTxt: {
    fontSize: 14,
  },

  // Arrow Styling
  arrowIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    // backgroundColor: 'cyan'
  },
});
