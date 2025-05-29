import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";

export function CreatedBetslipBattleCard({battle, handleEditBets, battleEndDate}) {
  return (
    <>
      <View style={s.btnContainer}>
        <Btn
          btnText={"Make Bets"}
          style={s.btn}
          // isEnabled={true}
          isEnabled={!battle.locked}
          onPress={handleEditBets}
        />
      </View>
      <View style={s.submitBetsNoticeContainer}>
        <Txt style={s.txtItalic}>
          Save your betslip by 11 AM on {battleEndDate}
        </Txt>
      </View>
    </>
  );
}

const s = StyleSheet.create({});
