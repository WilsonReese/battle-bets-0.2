import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Txt } from "../../../../../../components/general/Txt";
import { useBattleLeaderboard } from "../../../../../../hooks/useBattleLeaderboard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LockedBetslip } from "../../../../../../components/Leaderboard/LockedBetslip";
import { AuthContext } from "../../../../../../components/contexts/AuthContext";
import { formatDate } from "date-fns";

export default function BattleLeaderboard() {
  const {
    id: poolId,
    battleId,
    leagueSeasonId,
    poolName,
    battleEndDate,
    battleStatus,
  } = useLocalSearchParams();
  const screenHeight = Dimensions.get("window").height;
  const bottomSheetHeight = screenHeight * 0.54;
  const [selectedBetslip, setSelectedBetslip] = useState(null);
  const { currentUserId } = useContext(AuthContext);

  const battleCompleted = battleStatus === "completed";
  // const totalPointsIncrease = 10;

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["60%"], []);

  const { betslips } = useBattleLeaderboard(poolId, leagueSeasonId, battleId);

  return (
    <View style={s.container}>
      <Txt style={s.pageTitle}>
        {poolName} - {battleEndDate}
      </Txt>
      <Txt style={s.headingTxt}>Leaderboard</Txt>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomSheetHeight }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.leaderboardContainer}>
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
                style={[
                  s.leaderboardRow,
                  selectedBetslip?.id === b.id && s.selectedRow,
                ]}
                onPress={() => {
                  if (selectedBetslip?.id === b.id) {
                    // If tapping the currently selected betslip, toggle the sheet closed
                    setSelectedBetslip(null);
                    sheetRef.current?.close();
                  } else {
                    // If tapping a different betslip, set and open the sheet
                    setSelectedBetslip(b);
                    requestAnimationFrame(() => {
                      setTimeout(() => {
                        sheetRef.current?.snapToIndex(0);
                      }, 0);
                    });
                  }
                }}
              >
                <Txt style={[s.placeTxt, s.placeColumn]}>
                  {shouldShowRank ? b.rank : ""}
                </Txt>
                <View style={[s.playerColumn]}>
                  <Txt style={s.playerTxt}>@{b.name}
                  {b.user_id == currentUserId && (
                    <>
                      <Txt> </Txt>
                      <FontAwesome6 name="user-large" size={10} color="#54D18C" />
                    </>
                  )}
                  {battleCompleted ? (
                    <Txt style={s.seasonScoreTxt}> (+{b.league_points})</Txt>
                  ) : (
                    ""
                  )}
                  </Txt>
                </View>
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
        betslip={selectedBetslip}
        maxHeight={bottomSheetHeight}
        onClose={() => setSelectedBetslip(null)}
        battleCompleted={battleCompleted}
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
  pageTitle: {
    fontSize: 20,
    fontFamily: "Saira_600SemiBold",
  },
  headingTxt: {
    // color: "#061826",
    // fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 14,
    textTransform: "uppercase",
    color: "#B8C3CC",
    paddingBottom: 8,
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
    flex: .5,
    alignItems: "center",
    paddingRight: 4,
  },
  placeColumn: {
    flex: 0.5,
    textAlign: "center",
    // paddingRight: 20,
  },
  playerColumn: {
    flex: 4.5,

    // These show the correct user icon
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
    gap: 6,
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
  selectedRow: {
    backgroundColor: "#1D394E", // or whatever highlight color works with your theme
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
  seasonScoreTxt: {
    fontSize: 12,
    color: "#54D18C",
  },
});
