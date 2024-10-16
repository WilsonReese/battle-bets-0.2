import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, TouchableOpacity, Alert } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetContext } from "../contexts/BetContext";
import { ProgressIndicator } from "./ProgressIndicator";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { Btn } from "../general/Buttons/Btn";
import api from "../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function BetSlipHeading({
  poolId,
  isBetSlipShown,
  toggleBetSlip,
  scrollViewRef,
  betslipId,
  battleId
}) {
  const rotation = useRef(new Animated.Value(isBetSlipShown ? 1 : 0)).current;
  const { bets, areAllBetsComplete } = useBetContext();
  const arrowSubmitIcon = (
    <FontAwesome6 name="arrow-right" size={16} color="#F8F8F8" />
  );

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

  // Handle submitting the bets
  const handleSubmitBets = async () => {
    try {
      // 1. Make API request to create bets in the backend
      const response = await api.post(`pools/${poolId}/battles/${battleId}/betslips/${betslipId}/bets`, {
        bets: bets.map(bet => ({
          bet_option_id: bet.betOptionID, // Assuming bet ID maps to bet_option_id
          bet_amount: bet.betAmount,
        })),
      });
      console.log("Bets submitted, response:", response.data);

      // 2. After bets are successfully created, update the betslip status
      await api.patch(`pools/${poolId}/battles/${battleId}/betslips/${betslipId}`, { status: "submitted" });
      console.log("Betslip status updated to submitted");

      // 3. Clear the bets for the current battle in AsyncStorage
      await AsyncStorage.removeItem(`bets_${battleId}`);
      Alert.alert("Success", "Bets submitted successfully!");

    } catch (error) {
      console.error("Error submitting bets:", error.response || error);
      Alert.alert("Error", "Failed to submit bets.");
    }
  };

  return (
    <View style={s.container}>
      <View style={s.headingContainer}>
        <TouchableOpacity style={s.titleContainer} onPress={toggleBetSlip}>
          <Txt style={s.title}>Bet Slip</Txt>
          <Animated.View style={arrowStyle}>
            <FontAwesome6 name="chevron-up" size={16} color="#F8F8F8" />
          </Animated.View>
        </TouchableOpacity>
        <View style={s.btnContainer}>
          <Btn
            btnText={"Submit Bets"}
            icon={arrowSubmitIcon}
            style={s.btn}
            isEnabled={areAllBetsComplete()}
            onPress={handleSubmitBets} // Call the handleSubmitBets function when pressed
          />
        </View>
      </View>

      <View style={s.progressContainer}>
        <ProgressIndicator
          betOptionTypeProp={"spreadOU"}
          toggleBetSlip={toggleBetSlip}
          isBetSlipShown={isBetSlipShown}
          scrollViewRef={scrollViewRef}
        />
        <ProgressIndicator
          betOptionTypeProp={"moneyLine"}
          toggleBetSlip={toggleBetSlip}
          isBetSlipShown={isBetSlipShown}
          scrollViewRef={scrollViewRef}
        />
        <ProgressIndicator
          betOptionTypeProp={"prop"}
          toggleBetSlip={toggleBetSlip}
          isBetSlipShown={isBetSlipShown}
          scrollViewRef={scrollViewRef}
        />
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
    paddingVertical: 12,
    backgroundColor: "#184EAD",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    paddingRight: 8,
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  progressContainer: {
    backgroundColor: "#184EAD",
    flexDirection: "row",
    // paddingVertical: 4,
    // paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  payoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    // backgroundColor: "#0C9449",
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
});
