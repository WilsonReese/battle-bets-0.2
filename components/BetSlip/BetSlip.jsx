import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BetSlipHeading } from "./BetSlipHeading";
import { Txt } from "../general/Txt";
import { BetSlipDetails } from "./BetSlipDetails";

const { height } = Dimensions.get("window");
const betSlipHeight = (height * 3) / 5; // 3/5 of the screen height
const betSlipHeadingHeight = 77; // Define the height of the BetSlipHeading component

export function BetSlip({
  budget,
  totalBet,
  poolName,
  isBetSlipShown,
  setIsBetSlipShown,
}) {
  const animatedHeight = useRef(new Animated.Value(betSlipHeight)).current;

  const toggleBetSlip = () => {
    Animated.timing(animatedHeight, {
      toValue: isBetSlipShown ? betSlipHeadingHeight : betSlipHeight,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setIsBetSlipShown(!isBetSlipShown);
    });
  };

  return (
    <Animated.View style={[s.container, { height: animatedHeight }]}>
      <TouchableOpacity onPress={toggleBetSlip}>
        <BetSlipHeading
          poolName={poolName}
          budget={budget}
          totalBet={totalBet}
          isBetSlipShown={isBetSlipShown}
        />
      </TouchableOpacity>
      <View>
        <BetSlipDetails budget={budget} totalBet={totalBet} />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
