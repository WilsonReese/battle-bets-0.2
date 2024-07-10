import React from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetContext } from "../contexts/BetContext";

export function ProgressIndicator({ betOptionTypeProp, toggleBetSlip, isBetSlipShown}) {
  const { getBetOptionLongTitle, getTotalBetAmount, getBudget, setBetOptionType, betOptionType } =
    useBetContext();
  const title = getBetOptionLongTitle(betOptionTypeProp);
  const totalBetAmount = getTotalBetAmount(betOptionTypeProp);
  const budget = getBudget(betOptionTypeProp);


  return (
    <TouchableOpacity
      style={[s.container, 
        (betOptionType === betOptionTypeProp) && s.selectedIndicator
      ]}
      onPress={() => {
        setBetOptionType(betOptionTypeProp);
        {if (isBetSlipShown) {toggleBetSlip();}}
      }}
    >
      <View style={s.progressIndicator}>
        <Txt style={s.title}>{title}</Txt>
        <Txt style={s.amount}>{`$${budget - totalBetAmount} left`}</Txt>
      </View>
    </TouchableOpacity>
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
    borderBottomWidth: 2,
    borderColor: 'transparent', // Default border color
  },
  selectedIndicator: {
    borderColor: 'red'
  },
  title: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
    fontSize: 14,
  },
  amount: {
    color: "#061826",
    // fontFamily: "Saira_400Regular_Italic",
    fontSize: 14,
  },
});
