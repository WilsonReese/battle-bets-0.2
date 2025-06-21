import React from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetContext } from "../contexts/BetContext";

export function ProgressIndicator({
  betOptionTypeProp,
  isBetSlipShown,
  scrollViewRef,
  closeBetSlip,
}) {
  const {
    getBetOptionLongTitle,
    getTotalBetAmount,
    getBudget,
    setBetOptionType,
    betOptionType,
  } = useBetContext();
  const title = getBetOptionLongTitle(betOptionTypeProp);
  const totalBetAmount = getTotalBetAmount(betOptionTypeProp);
  const budget = getBudget(betOptionTypeProp);
  const isSelected = betOptionType === betOptionTypeProp;

  const handlePress = () => {
    if (!isSelected && isBetSlipShown) {
      closeBetSlip(); // Collapse the sheet if switching category
    }
    setBetOptionType(betOptionTypeProp);
    scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <TouchableOpacity
      style={[s.container, isSelected && s.selectedIndicator]}
      onPress={handlePress}
    >
      <View style={s.progressIndicator}>
        <Txt style={[s.title, isSelected && s.selectedText]}>{title}</Txt>
        <Txt style={[s.amount, isSelected && s.selectedText]}>{`$${
          budget - totalBetAmount
        } left`}</Txt>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    // flex: 1,
    // backgroundColor: 'green'
  },
  progressIndicator: {
    alignItems: "center",
    borderBottomWidth: 4,
    borderColor: "transparent", // Default border color
  },
  selectedIndicator: {
    borderBottomWidth: 4,
    borderColor: "#54D18C", // Highlight color for the selected state
    // backgroundColor: '#DAE1E5',
  },
  title: {
    // fontFamily: "Saira_600SemiBold",
    color: "#DAE1E5",
    fontSize: 14,
  },
  amount: {
    color: "#DAE1E5",
    fontSize: 14,
  },
  selectedText: {
    color: "#F8F8F8",
    fontFamily: "Saira_600SemiBold",
  },
});
