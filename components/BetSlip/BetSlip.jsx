import React, { useRef, useState } from "react";
import { StyleSheet, View, Animated, PanResponder, Dimensions } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { BetSlipBudget } from "./BetSlipBudget";
import { BetSlipHeading } from "./BetSlipHeading";

const { height } = Dimensions.get('window');
const betSlipHeight = height * 3 / 5; // 3/5 of the screen height
const betSlipHeadingHeight = 85;

export function BetSlip({ budget, totalBet, poolName }) {
  const [isShown, setIsShown] = useState(false);

  const toggleBetSlip = () => {
    setIsShown(!isShown);
  };

  return (
    <Animated.View style={[s.container, isShown ? s.shown : s.hidden]}>
      <View onTouchStart={toggleBetSlip}>
        <BetSlipHeading poolName={poolName} budget={budget} totalBet={totalBet} />
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
  shown: {
    height: betSlipHeight,
  },
  hidden:{
    height: betSlipHeadingHeight,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});