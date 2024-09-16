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

const { height } = Dimensions.get("window");
const betSlipHeight = (height * 3.2) / 5; 
const betSlipHeadingHeight = 148; // Define the height of the BetSlipHeading component (this controls how much of the betSlip is shown)

export function BetSlip({
  poolName,
  isBetSlipShown,
  setIsBetSlipShown,
  scrollViewRef
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
      <View>
        <BetSlipHeading
          poolName={poolName}
          isBetSlipShown={isBetSlipShown}
          toggleBetSlip={toggleBetSlip}
          scrollViewRef={scrollViewRef}
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
