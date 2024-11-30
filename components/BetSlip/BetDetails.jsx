import React from "react";
import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetDetails({name, matchup, time, multiplier}) {
  return (
    <View style={[s.container]}>
      <View style={s.betNameContainer}>
        <Txt style={[s.txt, s.betNameTxt]}>{name}</Txt>
        <Txt style={[s.txt, s.smallTxt]}>x2</Txt>
      </View>
      <View style={s.matchupContainer}>
        <Txt style={[s.txt, s.smallTxt]}>Texas at Texas A&M</Txt>
        <Txt style={[s.txt, s.smallTxt]}>3:30 PM</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {},
  txt: {
    color: "#061826",
  },
  betNameContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  betNameTxt: {
    fontFamily: 'Saira_600SemiBold',
    fontSize: 15,

  },
  matchupContainer: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  smallTxt: {
    fontSize: 12,
  }
});
