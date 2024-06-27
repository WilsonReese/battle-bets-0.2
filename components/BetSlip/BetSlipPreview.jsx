import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { FontAwesome6 } from "@expo/vector-icons";
import { Budget } from "./Budget";
import { useState } from "react";
import { BetSlipBudget } from "./BetSlipBudget";

export function BetSlipPreview({ budget, totalBet, poolName }) {
  const arrowIcon = (
    <FontAwesome6 name="arrow-right" size={16} color="#F8F8F8" />
  );

  return (
    <View style={s.container}>
      {/* <View style={s.betSlipHeading}>
        <View style={s.grabHandle}>
          <Txt style={{ color: "black" }}>------</Txt>
        </View>
        <View style={s.detailsContainer}>
          <View style={s.budget}>
            <Budget
              betType={"Spread & Over/Under"}
              budget={budget}
              totalBet={totalBet}
            />
          </View>
          <View style={s.btn}>
            <Btn
              btnText={"Next"}
              isEnabled={true}
              btnSecondaryText={"Money Line"}
              icon={arrowIcon}
            />
          </View>
        </View>
      </View> */}
      <View style={s.betSlipHeading}>
        <View style={s.grabHandle}>
          <Txt style={{ color: "black" }}>------</Txt>
        </View>
        <View style={s.detailsContainer}>
          <Txt style={s.title}>Bet Slip - Pool {poolName}</Txt>
        </View>
      </View>
      <BetSlipBudget
        betType={"Spread and Over/Under"}
        budget={budget}
        totalBet={totalBet}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // this keeps the betslip preview on the bottom and spanning the width
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F8F8F8",

    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  betSlipHeading: {
    // backgroundColor: "blue",
    // paddingVertical: 4,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    color: '#061826',
    fontFamily: 'Saira_600SemiBold'
  }, 
  grabHandle: {
    alignSelf: "center",
    margin: -4,
  },

  // NOT CURRENTLY IN USE
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budget: {
    flex: 3,
  },
  btn: {
    flex: 2,
    alignItems: "flex-end",
  },
});
