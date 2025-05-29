import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";
import { StatusIcon } from "../general/StatusIcon";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function FilledOutUnlockedBattleCard({
  battle,
  handleEditBets,
  battleEndDateTime,
}) {
  return (
    <View style={s.container}>
      <View style={s.timerContainer}>
        <Txt style={s.countdownHeadingTxt}>Bets due</Txt>
        <CountdownTimer targetDate={battleEndDateTime} version="small" />
      </View>
      <View style={s.betslipInfoContainer}>
        <Txt style={s.betInfoTxt}>$2000 to bet</Txt>
        <Txt style={s.betInfoTxt}>$10000 max</Txt>
      </View>
      <View style={s.iconContainer}>
        <FontAwesome6 name="circle-right" size={18} color="#54D18C" />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    gap: 6,
  },
  betslipInfoContainer: {
    // flex: 1,
    // backgroundColor: "blue",
    alignItems: "flex-end",
    // paddingHorizontal: 6,
  },
  timerContainer: {
    // flex: 2,
    // backgroundColor: "green",
    // alignItems: 'flex-start'
  },
  countdownHeadingTxt: {
    // color: "#061826",
    // fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 10,
    textTransform: "uppercase",
    color: "#B8C3CC",
    // paddingTop: 8,
    alignSelf: "center",
  },
  iconContainer: {
    // position: "absolute",
    // right: 0,
    // top: "50%",
    // justifyContent: 'center'
  },
  betInfoTxt: {
    fontSize: 14,
  },
});
