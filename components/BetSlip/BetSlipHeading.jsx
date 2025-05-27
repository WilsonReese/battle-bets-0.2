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
import isEqual from "lodash.isequal";

export function BetSlipHeading({
  poolId,
  isBetSlipShown,
  toggleBetSlip,
  scrollViewRef,
  leagueSeasonId,
  betslipId,
  battleId,
}) {
  const rotation = useRef(new Animated.Value(isBetSlipShown ? 1 : 0)).current;
  const {
    bets,
    initialBetsSnapshot,
    setInitialBetsSnapshot,
    setBets,
    betsToRemove,
    setBetsToRemove,
  } = useBetContext();
  const [hasChanges, setHasChanges] = useState(false);
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

  useEffect(() => {
    // Whenever bets or betsToRemove change, re-evaluate if Save should be enabled
    const betsChanged = !isEqual(bets, initialBetsSnapshot);
    const hasRemovals = betsToRemove.length > 0;
    setHasChanges(betsChanged || hasRemovals);
  }, [bets, betsToRemove, initialBetsSnapshot]);

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

  // // Handle submitting the bets
  // const handleSubmitBets = async () => {
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);

  //   try {
  //     // Categorize the bets: new, updated, and removed
  //     const newBets = bets.filter((bet) => bet.isNew);
  //     const updatedBets = bets.filter(
  //       (bet) => !bet.isNew && !betsToRemove.includes(bet.id)
  //     );
  //     const removedBets = betsToRemove;

  //     // Prepare the payload
  //     const payload = {
  //       bets: {
  //         new_bets: newBets.map(({ betOptionID, betAmount }) => ({
  //           bet_option_id: betOptionID,
  //           bet_amount: betAmount,
  //         })),
  //         updated_bets: updatedBets.map(({ id, betOptionID, betAmount }) => ({
  //           id,
  //           bet_option_id: betOptionID,
  //           bet_amount: betAmount,
  //         })),
  //         removed_bets: removedBets,
  //       },
  //     };

  //     console.log("Removed Bets:", removedBets);

  //     // Call the backend endpoint with the unified logic
  //     const response = await api.patch(
  //       `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`,
  //       payload
  //     );
  //     console.log("Bets submitted", response.data);

  //     // 2. After bets are successfully created, update the betslip status
  //     await api.patch(
  //       `pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}`,
  //       { status: "submitted" }
  //     );
  //     console.log("Betslip status updated to submitted");

  //     // 3. Clear the bets for the current battle in AsyncStorage
  //     await AsyncStorage.removeItem(`bets-${battleId}`);
  //     console.log("Async storage cleared");
  //     const storedBets = await AsyncStorage.getItem(`bets-${battleId}`);
  //     console.log("Stored Bets:", `bets-${battleId}`, storedBets);

  //     setBets([]);
  //     setBetsToRemove([]);
  //     console.log("Bet state cleared");

  //     // 4. Navigate to the pool page
  //     router.back(`/pools/${poolId}`);
  //     Alert.alert("Success", "Bets submitted successfully!");
  //   } catch (error) {
  //     console.error("Error submitting bets:", error.response || error);
  //     Alert.alert("Error", "Failed to submit bets.");
  //   } finally {
  //     setIsSubmitting(false); // Reset submission state
  //   }
  // };

  const handleSaveBets = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Categorize the bets
      const newBets = bets.filter((bet) => bet.isNew);
      const updatedBets = bets.filter(
        (bet) => !bet.isNew && !betsToRemove.includes(bet.id)
      );
      const removedBets = betsToRemove;

      // Build the payload
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

      // Save to backend
      await api.patch(
        `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`,
        payload
      );

      // Normalize: mark all as not new after save
      const normalizedBets = bets.map((bet) => ({
        ...bet,
        isNew: false,
      }));

      // Store locally
      await AsyncStorage.setItem(
        `bets-${battleId}`,
        JSON.stringify(normalizedBets)
      );

      // Update context state
      setBets(normalizedBets);
      setInitialBetsSnapshot(normalizedBets);
      setBetsToRemove([]);
      setHasChanges(false);

      Alert.alert("Saved", "Your bets have been saved.");
    } catch (error) {
      console.error("Error saving bets:", error.response || error);
      Alert.alert("Error", "Failed to save bets.");
    } finally {
      setIsSubmitting(false);
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
            btnText={"Save "}
            icon={arrowSubmitIcon}
            style={s.btn}
            isEnabled={hasChanges && !isSubmitting}
            onPress={handleSaveBets} // Call the handleSubmitBets function when pressed
          />
        </View>
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
