import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function CreatedBetslipBattleCard({
  battle,
  handleEditBets,
  battleEndDateTime,
}) {
  return (
    // <View>
    //   <Txt style={s.countdownHeadingTxt}>Bets due</Txt>
    //   <CountdownTimer targetDate={battleEndDateTime} version="large" />
    //   <View style={s.btnContainer}>
    //     <Btn
    //       btnText={"Make Bets"}
    //       style={s.btn}
    //       // isEnabled={true}
    //       isEnabled={!battle.locked}
    //       onPress={handleEditBets}
    //     />
    //   </View>
    // </View>
    <View style={s.container}>
      <View style={s.countdownContainer}>
        <Txt style={s.countdownHeadingTxt}>Bets due</Txt>
        <CountdownTimer targetDate={battleEndDateTime} version="large" />
      </View>
      <View style={s.iconContainer}>
        <FontAwesome6 name="circle-right" size={18} color="#54D18C" />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // backgroundColor: 'green'
  },
  countdownContainer: {
    flex: 1,
    paddingRight: 24
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: '50%',
    // justifyContent: 'center'
  },
  txt: {
    fontSize: 14,
    alignSelf: "center",
    fontFamily: "Saira_600SemiBold",
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
    alignSelf: "center",
  },
  btn: {
    paddingVertical: 8,
    marginTop: 8,
  },
});
