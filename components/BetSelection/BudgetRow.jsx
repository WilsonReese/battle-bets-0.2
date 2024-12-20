import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { useBetContext } from "../contexts/BetContext";
import { ProgressIndicator } from "../BetSlip/ProgressIndicator";

export function BudgetRow({ isBetSlipShown, scrollViewRef, toggleBetSlip }) {
  return (
    <View style={s.container}>
      <View style={s.progressIndicatorsContainer}>
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
      <View style={s.separatorLine} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginHorizontal: -8
  },

    progressIndicatorsContainer: {
    // backgroundColor: "#184EAD",
    flexDirection: "row",
    // paddingVertical: 4,
    // paddingHorizontal: 8,
    justifyContent: "space-between",
  },

  separatorLine: {
    height: 1,
    backgroundColor: "#3A454D",
  },
});
