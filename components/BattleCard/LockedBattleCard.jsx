import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";
import { StatusIcon } from "../general/StatusIcon";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useBetContext } from "../contexts/BetContext";
import { useBattleLeaderboard } from "../../hooks/useBattleLeaderboard";

export function LockedBattleCard({
  battle,
  handleEditBets,
  battleEndDateTime,
  userBetslip,
  poolId,
}) {
  const { betslips, loading } = useBattleLeaderboard(
    poolId,
    battle.league_season_id,
    battle.id
  );
  const topThree = betslips.slice(0, 3);

  const { getBudgetForBattle } = useBetContext();
  const remaining = getBudgetForBattle(battle.id);

  console.log("User Betslip", userBetslip);
  console.log("Remaining Budget", remaining);
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
        {topThree.map((b, index) => (
          <View key={b.id} style={s.leaderboardRow}>
            <Txt style={[s.placeTxt, s.placeColumn]}>{index + 1}</Txt>
            <Txt style={[s.playerTxt, s.playerColumn]}>@{b.name}</Txt>
            <Txt style={[s.placeTxt, s.column]}>${b.earnings}</Txt>
            <Txt style={[s.placeTxt, s.column]}>${b.max_payout_remaining}</Txt>
          </View>
        ))}
      </View>

      {/* Vertical Line Separator */}
      <View style={{width: .5, height: 60, backgroundColor: '#284357', alignSelf: 'center' }}></View>

      {/* Betslip Section */}
      <View style={s.betslipContainer}>
        <Txt style={s.headingTxt}>Betslip</Txt>
        <Txt style={s.betInfoTxt}>1st Place</Txt>
        <Txt style={s.betInfoTxt}>${userBetslip.earnings} Won</Txt>
        <Txt style={s.betInfoTxt}>${userBetslip.max_payout_remaining} Max</Txt>
        <Txt style={s.betInfoTxt}>100% Hit Rate</Txt>
      </View>

      {/* Arrow Icon */}
      <View style={{alignSelf: 'center'}}>
        <FontAwesome6 name="circle-right" size={18} color="#54D18C" />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
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
    textAlign: 'center'
    // justifyContent: 'center'
  },
  placeColumn: {
    flex: 0.5,
    alignSelf: 'center'
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

  // Betslip container text
  betslipContainer: {
    flex: 1.1,
    // backgroundColor: 'blue',
  },
  betInfoTxt: {
    // fontFamily: "Saira_600SemiBold",
    fontSize: 12,
  },
  dollarTxt: {
    fontSize: 14,
  },
  placeTxt: {
    width: 40,
    fontSize: 12,
  },
  playerTxt: {
    // flex: 1,
    fontSize: 12,
    fontFamily: "Saira_400Regular_Italic",
  },
});
