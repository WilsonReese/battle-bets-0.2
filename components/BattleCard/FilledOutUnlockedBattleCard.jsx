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
        <Txt style={s.countdownHeadingTxt}>Betslip</Txt>
        <View style={s.betslipElement}>
          <Txt style={s.betInfoTxt}>To Bet:</Txt>
          <Txt style={s.dollarTxt}>$2000</Txt>
        </View>
        <View style={[s.betslipElement, {marginTop: -4}]}>
          <Txt style={s.betInfoTxt}>Max:</Txt>
          <Txt style={s.dollarTxt}>$23000</Txt>
        </View>
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
    alignItems: "flex-start",
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
    // alignSelf: "center",
  },
  iconContainer: {
    // position: "absolute",
    // right: 0,
    // top: "50%",
    // justifyContent: 'center'
  },
  betInfoTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 12,
  },
  dollarTxt: {
    fontSize: 14,
  },
  betslipElement: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 8,
  },
});
