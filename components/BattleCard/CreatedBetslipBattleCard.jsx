import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";

export function CreatedBetslipBattleCard({
  battle,
  handleEditBets,
  battleEndDateTime,
}) {
  return (
    <View style={s.container}>
      <Txt style={s.countdownHeadingTxt}>Bets due</Txt>
      <CountdownTimer targetDate={battleEndDateTime} version="large" />
      <View style={s.btnContainer}>
        <Btn
          btnText={"Make Bets"}
          style={s.btn}
          // isEnabled={true}
          isEnabled={!battle.locked}
          onPress={handleEditBets}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {

  },
  txt: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: 'Saira_600SemiBold',
    marginBottom: -4,
  },
  countdownHeadingTxt: {
    // color: "#061826",
    // fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 12,
    textTransform: "uppercase",
    color: "#B8C3CC",
    paddingTop: 8,
    alignSelf: 'center',
  },
  btn: {
    paddingVertical: 8,
    marginTop: 8, 
  }
});
