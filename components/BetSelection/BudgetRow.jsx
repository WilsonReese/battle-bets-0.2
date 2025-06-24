import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { ProgressIndicator } from "../BetSlip/ProgressIndicator";

export function BudgetRow({ isBetSlipShown, scrollViewRef, closeBetSlip}) {
  return (
    <View style={s.container}>
      <View style={s.progressIndicatorsContainer}>
        <ProgressIndicator
          betOptionTypeProp={"spreadOU"}
          isBetSlipShown={isBetSlipShown}
          closeBetSlip={closeBetSlip}
          scrollViewRef={scrollViewRef}
        />
        <ProgressIndicator
          betOptionTypeProp={"moneyLine"}
          isBetSlipShown={isBetSlipShown}
          closeBetSlip={closeBetSlip}
          scrollViewRef={scrollViewRef}
        />
        <ProgressIndicator
          betOptionTypeProp={"prop"}
          isBetSlipShown={isBetSlipShown}
          closeBetSlip={closeBetSlip}
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
    // height: .5,
    backgroundColor: "#425C70",
  },
});
