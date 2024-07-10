import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetContext } from "../contexts/BetContext";
import { ProgressIndicator } from "./ProgressIndicator";

export function BetSlipHeading({ poolName, isBetSlipShown, toggleBetSlip }) {
  const rotation = useRef(new Animated.Value(isBetSlipShown ? 1 : 0)).current;
  const { bets } = useBetContext();


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

  function calculateTotalPayout() {
    return bets.reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  return (
    <View style={s.container}>
      <TouchableOpacity style={s.headingContainer} onPress={toggleBetSlip}>
        <Txt style={s.title}>Bet Slip - Pool {poolName}</Txt>
        <Animated.View style={arrowStyle}>
          <FontAwesome6 name="chevron-up" size={24} color="#F8F8F8" />
        </Animated.View>
      </TouchableOpacity>
      <View style={s.progressContainer}>

        <ProgressIndicator betOptionTypeProp={"spreadOU"} toggleBetSlip={toggleBetSlip} isBetSlipShown={isBetSlipShown} />
        <ProgressIndicator betOptionTypeProp={"moneyLine"} toggleBetSlip={toggleBetSlip} isBetSlipShown={isBetSlipShown}/>
        <ProgressIndicator betOptionTypeProp={"prop"} toggleBetSlip={toggleBetSlip} isBetSlipShown={isBetSlipShown}/>

      </View>
      <View style={s.payoutContainer}>
        <Txt style={s.payoutHeading}>Total Potential Payout: </Txt>
        <Txt style={s.payoutText}>${calculateTotalPayout()}</Txt>
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
    backgroundColor: "#184EAD",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  payoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#0C9449",
    // borderTopWidth: 1,
    // borderColor: "#B8C3CC",
    // marginHorizontal: 8,
  },
  payoutHeading: {
    color: "#061826",
    textTransform: "uppercase",
    fontFamily: "Saira_600SemiBold",
    // fontSize: 14
  },
  payoutText: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 18,
  },
  progressContainer: {
    // backgroundColor: 'blue',
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 8,
    justifyContent: "space-between"
  },
  title: {
    fontSize: 20,
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
  },
  progressIndicator: {
    // borderRightWidth: 1,
    // borderLeftWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignItems: 'center',
  }
});
