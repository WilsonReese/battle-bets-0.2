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
  const isSelected = betOptionType === betOptionTypeProp;


  return (
    <TouchableOpacity
    style={[s.container, isSelected && s.selectedIndicator]}
    onPress={() => {
      setBetOptionType(betOptionTypeProp);
      if (isBetSlipShown) {
        toggleBetSlip();
      }
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
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  progressIndicator: {
    alignItems: "center",
    borderBottomWidth: 3,
    borderColor: 'transparent', // Default border color
  },
  selectedIndicator: {
    borderBottomWidth: 3,
    borderColor: '#54D18C', // Highlight color for the selected state
    // backgroundColor: '#DAE1E5',
    borderRadius: 4,
  },
  title: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
    fontSize: 14,
  },
  amount: {
    color: "#061826",
    fontSize: 14,
  },
});
