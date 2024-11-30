import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { useBetContext } from "../contexts/BetContext";
import { ProgressIndicator } from "../BetSlip/ProgressIndicator";

export function BudgetRow({ isBetSlipShown, scrollViewRef, toggleBetSlip}) {
  return (
    <View style={s.container}>
      <ProgressIndicator
        betOptionTypeProp={"spreadOU"}
        isBetSlipShown={isBetSlipShown}
        toggleBetSlip={toggleBetSlip}
        scrollViewRef={scrollViewRef}
      />
      <ProgressIndicator
        betOptionTypeProp={"moneyLine"}
        isBetSlipShown={isBetSlipShown}
        toggleBetSlip={toggleBetSlip}
        scrollViewRef={scrollViewRef}
      />
      <ProgressIndicator
        betOptionTypeProp={"prop"}
        isBetSlipShown={isBetSlipShown}
        toggleBetSlip={toggleBetSlip}
        scrollViewRef={scrollViewRef}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // backgroundColor: "#184EAD",
    flexDirection: "row",
    marginHorizontal: -8,
    // paddingVertical: 4,
    // paddingHorizontal: 8,
    justifyContent: "space-between",
  },
});
