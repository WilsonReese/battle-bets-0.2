import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Txt } from "../../../../../../components/general/Txt";
import { useBattleLeaderboard } from "../../../../../../hooks/useBattleLeaderboard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LockedBetslip } from "../../../../../../components/Leaderboard/LockedBetslip";

export default function BattleLeaderboard() {
  const { id: poolId, battleId, leagueSeasonId } = useLocalSearchParams();

  const sheetRef = useRef(null);
  const [selectedBetslip, setSelectedBetslip] = useState(null);
  const snapPoints = useMemo(() => ["25%", "70%"], []);

  const { betslips } = useBattleLeaderboard(poolId, leagueSeasonId, battleId);

  console.log("Betslips on Leaderboard: ", betslips);
  console.log("Params:", useLocalSearchParams());

  return (
    <View style={s.container}>
      <Txt>Battle Leaderboard for Pool(?) {poolId}</Txt>
      <ScrollView>
        <View style={s.leaderboardContainer}>
          <Txt style={s.headingTxt}>Leaderboard</Txt>
          <View style={s.leaderboardHeaderRow}>
            <Txt style={[s.headerRowTxt, s.placeColumn]}> </Txt>
            <Txt style={[s.headerRowTxt, s.playerColumn]}>Player</Txt>
            <Txt style={[s.headerRowTxt, s.column]}>Won</Txt>
            <Txt style={[s.headerRowTxt, s.column]}>Max</Txt>
            <Txt style={[s.headerRowTxt, s.column]}>Hit</Txt>
            <Txt style={[s.headerRowTxt, s.iconColumn]}></Txt>
          </View>
          {betslips.map((b, index) => {
            const prev = betslips[index - 1];
            const shouldShowRank = !prev || b.rank !== prev.rank;

            return (
              <TouchableOpacity
                key={b.id}
                style={s.leaderboardRow}
                onPress={() => {
                  setSelectedBetslip(b);
                  setTimeout(() => {
                    sheetRef.current?.snapToIndex(0);
                  }, 10); // even 10ms is usually enough
                }}
              >
                <Txt style={[s.placeTxt, s.placeColumn]}>
                  {shouldShowRank ? b.rank : ""}
                </Txt>
                <Txt style={[s.playerTxt, s.playerColumn]}>@{b.name}</Txt>
                <Txt style={[s.placeTxt, s.column]}>${b.earnings}</Txt>
                <Txt style={[s.placeTxt, s.column]}>
                  ${b.max_payout_remaining}
                </Txt>
                <Txt style={[s.placeTxt, s.column]}>
                  {b?.hitRate != null ? `${b.hitRate}%` : "—"}
                </Txt>
                <View style={[s.iconColumn]}>
                  <FontAwesome6
                    name="circle-chevron-right"
                    size={14}
                    color="#54D18C"
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <LockedBetslip
        sheetRef={sheetRef}
        selectedBetslip={selectedBetslip}
        snapPoints={snapPoints}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    padding: 8,
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
    alignItems: "center",
  },
  iconColumn: {
    flex: 1,
    alignItems: "center",
  },
  placeColumn: {
    flex: 0.5,
    textAlign: "center",
    // paddingRight: 20,
  },
  playerColumn: {
    flex: 4.5,
  },
  leaderboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    // borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#284357",
  },
  placeTxt: {
    // width: 40,
    fontSize: 12,
  },
  playerTxt: {
    // flex: 1,
    fontSize: 14,
    fontFamily: "Saira_600SemiBold",
  },
});
