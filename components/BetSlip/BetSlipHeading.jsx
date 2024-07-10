import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { FontAwesome6 } from "@expo/vector-icons";

export function BetSlipHeading({ poolName, budget, totalBet, isBetSlipShown }) {
  const rotation = useRef(new Animated.Value(isBetSlipShown ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isBetSlipShown ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isBetSlipShown]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const arrowStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={s.container}>
      <View style={s.headingContainer}>
        <Txt style={s.title}>Bet Slip - Pool {poolName}</Txt>
        <Animated.View style={arrowStyle}>
          <FontAwesome6 name="chevron-up" size={24} color="#F8F8F8" />
        </Animated.View>
      </View>
      <View style={s.payoutContainer}>
        <Txt>Total Payout?</Txt>
        <Txt>Progress?</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // height: 40, // This controls how tall the heading is (pushes down the BetSlipDetails, should be equal to betSlipHeadingHeight on the BetSlip
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#184EAD',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  payoutContainer: {
    backgroundColor: 'green'
  },
  title: {
    fontSize: 20,
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
  },
});
