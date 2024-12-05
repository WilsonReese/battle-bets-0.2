import React from "react";
import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetDetails({ name, matchup, time, multiplier }) {
  return (
    <View style={[s.container]}>
      <View style={s.betInfoContainer}>
        <View style={s.betNameContainer}>
          <Txt style={[s.txt, s.betNameTxt]}>{name}</Txt>
        </View>
        <View style={s.betPayoutContainer}>
          <Txt style={[s.txt, s.smallTxt]}>x{multiplier}</Txt>
        </View>
      </View>
      <View style={s.matchupContainer}>
        <Txt style={[s.txt, s.smallTxt]}>{matchup}</Txt>
        <Txt style={[s.txt, s.smallTxt]}>{time}</Txt>
        {/* <Txt style={[s.txt, s.smallTxt]}>x{multiplier}</Txt> */}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {},
  txt: {
    color: "#061826",
  },
  betInfoContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
  },
  betNameContainer:{
    flex: 7,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'green'
  },
  betPayoutContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  betNameTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 15,
    lineHeight: 18,
    textAlignVertical: 'center',
    paddingTop: 3
  },
  matchupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallTxt: {
    fontSize: 11,
  },
});
