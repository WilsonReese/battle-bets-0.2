import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";
import { StatusIcon } from "../general/StatusIcon";

export function FilledOutUnlockedBattleCard({
  battle,
  handleEditBets,
  battleEndDateTime,
}) {
  return (
    <View style={s.container}>
      <CountdownTimer targetDate={battleEndDateTime} version="small" />
      <Txt>Budget Remaining</Txt>
      <Txt>Max</Txt>
      <Btn
        btnText={"Edit Bets"}
        style={s.btn}
        isEnabled={!battle.locked}
        onPress={handleEditBets}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {

  },

});
