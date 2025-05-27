import React from "react";
import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetAmount({ betAmount, toWinAmount }) {
  return (
    <View>
      <View style={[s.container]}>
        <View>
          <Txt style={[s.txt, s.boldTxt]}>${betAmount}</Txt>
        </View>
        <View>
          <Txt style={[s.txt]}> to win </Txt>
        </View>
        <View>
          <Txt style={[s.txt, s.boldTxt]}>${toWinAmount}</Txt>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'red',
  },
  txt: {
    // color: "#061826",
    fontSize: 13,
  },
  boldTxt: {
    fontFamily: "Saira_600SemiBold",
  },
  smallTxt: {
    fontSize: 11,
  },
});
