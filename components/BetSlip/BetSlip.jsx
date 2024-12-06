import React, { useRef } from "react";
import {
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import { BetSlipHeading } from "./BetSlipHeading";
import { BetSlipDetails } from "./BetSlipDetails";

export function BetSlip({
  poolId,
  isBetSlipShown,
  setIsBetSlipShown,
  scrollViewRef,
  betslipId,
  battleId,
  height,
  betSlipHeight,
  betSlipHeadingHeight, 
  animatedHeight,
  toggleBetSlip
}) {

  return (
    <Animated.View style={[s.container, { height: animatedHeight }]}>
      <View>
        <BetSlipHeading
          poolId={poolId}
          isBetSlipShown={isBetSlipShown}
          toggleBetSlip={toggleBetSlip}
          scrollViewRef={scrollViewRef}
          betslipId={betslipId}
          battleId={battleId}
        />
      </View>
      <BetSlipDetails toggleBetSlip={toggleBetSlip} />
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
      height: -3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
