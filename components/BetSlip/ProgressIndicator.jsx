import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetContext } from "../contexts/BetContext";

export function ProgressIndicator({ betOptionType }) {
    const { getBetOptionLongTitle, getTotalBetAmount, getBudget } = useBetContext();
    const title = getBetOptionLongTitle(betOptionType)
    const totalBetAmount = getTotalBetAmount(betOptionType)
    const budget = getBudget(betOptionType)


  
    return (
    <View style={s.container}>
      <View style={s.progressIndicator}>
        <Txt style={s.title}>{title}</Txt>
        <Txt style={s.amount}>{`$${budget - totalBetAmount} left`}</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // height: 40, // This controls how tall the heading is (pushes down the BetSlipDetails, should be equal to betSlipHeadingHeight on the BetSlip
  },
  progressIndicator: {
    // borderRightWidth: 1,
    // borderLeftWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  title: {
   fontFamily: 'Saira_600SemiBold',
   color: '#061826'
  },
  amount: {
    color: '#061826',
    fontSize: 14,
  }
});
