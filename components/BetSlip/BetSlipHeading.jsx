import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetContext } from "../contexts/BetContext";
import { ProgressIndicator } from "./ProgressIndicator";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { Btn } from "../general/Buttons/Btn";
import api from "../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export function BetSlipHeading({
  poolId,
  isBetSlipShown,
  toggleBetSlip,
  scrollViewRef,
  betslipId,
  battleId,
}) {
  const rotation = useRef(new Animated.Value(isBetSlipShown ? 1 : 0)).current;
  const { bets, areAllBetsComplete, setBets, betsToRemove, setBetsToRemove } = useBetContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Make API request to create bets in the backend
      // const response = await api.post(`pools/${poolId}/battles/${battleId}/betslips/${betslipId}/bets`, {
      //   bets: bets.map(bet => ({
      //     bet_option_id: bet.betOptionID,
      //     bet_amount: bet.betAmount,
      //   })),
      // });
      // console.log("Bets submitted, response:", response.data);
      // Categorize the bets: new, updated, and removed
      const newBets = bets.filter((bet) => bet.isNew);
      const updatedBets = bets.filter(
        (bet) => !bet.isNew && !betsToRemove.includes(bet.id)
      );
      const removedBets = betsToRemove;

      // Prepare the payload
      const payload = {
        bets: {
          new_bets: newBets.map(({ betOptionID, betAmount }) => ({
            bet_option_id: betOptionID,
            bet_amount: betAmount,
          })),
          updated_bets: updatedBets.map(({ id, betOptionID, betAmount }) => ({
            id,
            bet_option_id: betOptionID,
            bet_amount: betAmount,
          })),
          removed_bets: removedBets,
        },
      };

      console.log('Removed Bets:', removedBets)
      
      // Call the backend endpoint with the unified logic
      const response = await api.patch(
        `/pools/${poolId}/battles/${battleId}/betslips/${betslipId}/bets`,
        payload
      );
      console.log("Bets submitted", response.data);

      // 2. After bets are successfully created, update the betslip status
      await api.patch(
        `pools/${poolId}/battles/${battleId}/betslips/${betslipId}`,
        { status: "submitted" }
      );
      console.log("Betslip status updated to submitted");

      // 3. Clear the bets for the current battle in AsyncStorage
      await AsyncStorage.removeItem(`bets-${battleId}`);
      console.log("Async storage cleared");
      const storedBets = await AsyncStorage.getItem(`bets-${battleId}`);
      console.log("Stored Bets:", `bets-${battleId}`, storedBets);

      setBets([]);
      setBetsToRemove([]);
      console.log("Bet state cleared");

      // 4. Navigate to the pool page
      router.push(`/pools/${poolId}`);
      Alert.alert("Success", "Bets submitted successfully!");
    } catch (error) {
      console.error("Error submitting bets:", error.response || error);
      Alert.alert("Error", "Failed to submit bets.");
    } finally {
      setIsSubmitting(false); // Reset submission state
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

// const handleSubmitBets = async () => {
//   if (isSubmitting) return;
//   setIsSubmitting(true);

//   try {
//     const newBets = bets.filter((bet) => !bet.id); // Bets without an ID are new
//     const updatedBets = bets.filter((bet) => bet.id && !betsToRemove.includes(bet.id));
//     const removedBetIds = betsToRemove; // Bets to remove

//     const payload = {
//       new_bets: newBets.map(({ betOptionID, betAmount }) => ({
//         bet_option_id: betOptionID,
//         bet_amount: betAmount,
//       })),
//       updated_bets: updatedBets.map(({ id, betOptionID, betAmount }) => ({
//         id,
//         bet_option_id: betOptionID,
//         bet_amount: betAmount,
//       })),
//       removed_bet_ids: removedBetIds,
//     };

//     const response = await api.patch(
//       `/pools/${poolId}/battles/${battleId}/betslips/${betslipId}/bets`,
//       { bets: payload }
//     );

//     console.log("Bets successfully updated:", response.data);
//     Alert.alert("Success", "Bets updated successfully!");
//     router.push(`/pools/${poolId}`);
//   } catch (error) {
//     console.error("Error updating bets:", error.response || error);
//     Alert.alert("Error", "Failed to update bets.");
//   } finally {
//     setIsSubmitting(false);
//   }
// };
