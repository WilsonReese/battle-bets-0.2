import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { useEffect, useState } from "react";
import { FontAwesome6 } from '@expo/vector-icons';

export function BetSlipBudget({ betType, budget, totalBet }) {
  const check = <FontAwesome6 name="check" size={16} color="#0C9449" />

  return (
    <View style={s.container}>
      <Txt style={s.title}>{betType}</Txt>
      <View style={s.budget}>
        <Txt style={s.budgetText}>${totalBet}</Txt>
        <Txt style={s.text}> of </Txt>
        <Txt style={s.budgetText}>${budget}</Txt>
        <Txt style={s.text}> spent</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    // borderTopWidth: 1,
    // borderTopColor: '#DAE1E5',
    backgroundColor: '#5996FF',
    paddingHorizontal: 8,
    alignItems: 'baseline'
  },
  budget: {
    flexDirection: "row",
    // backgroundColor: 'green',
    alignItems: "center",
    // paddingVertical: 4,
    // paddingHorizontal: 12,
    // // borderRadius: 20,
    // // borderWidth: 1,
  },
  title: {
    // color: "#061826",
    fontFamily: 'Saira_600SemiBold'
  }, 
  text: {
    // color: "#061826",
    fontSize: 14,
  },
  budgetText: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
});
