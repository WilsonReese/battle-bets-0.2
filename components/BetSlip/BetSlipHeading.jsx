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
import { useToastMessage } from "../../hooks/useToastMessage";

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
    convertToCamelCase,
    transformBackendBets,
    closeAllBetSelectors,
  } = useBetContext();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useToastMessage();

  // useEffect(() => {
  //   Animated.timing(rotation, {
  //     toValue: isBetSlipShown ? 1 : 0,
  //     duration: 150,
  //     useNativeDriver: true,
  //   }).start();
  // }, [isBetSlipShown]);

  useEffect(() => {
    // Whenever bets or betsToRemove change, re-evaluate if Save should be enabled
    const betsChanged = !isEqual(bets, initialBetsSnapshot);
    const hasRemovals = betsToRemove.length > 0;
    setHasChanges(betsChanged || hasRemovals);
  }, [bets, betsToRemove, initialBetsSnapshot]);

  // const rotateInterpolate = rotation.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["0deg", "180deg"],
  // });

  // const arrowStyle = {
  //   transform: [{ rotate: rotateInterpolate }],
  // };

  function calculateTotalPayout() {
    return bets.reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  const handleSaveBets = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Prepare payload
      const newBets = bets.filter((bet) => bet.isNew);
      const updatedBets = bets.filter(
        (bet) => !bet.isNew && !betsToRemove.includes(bet.id)
      );
      const removedBets = betsToRemove;

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

      // 2. Save to backend
      await api.patch(
        `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`,
        payload
      );

      // 3. Update betslip status to filled_out
      await api.patch(
        `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}`,
        { betslip: { status: "filled_out" } }
      );

      // 4. Re-fetch from backend to get clean, authoritative bet data
      const res = await api.get(
        `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`
      );

      const normalizedBets = transformBackendBets(res.data.bets);

      await AsyncStorage.setItem(
        `bets-${battleId}`,
        JSON.stringify(normalizedBets)
      );
      setBets(normalizedBets);
      setInitialBetsSnapshot(normalizedBets);
      setBetsToRemove([]);
      setHasChanges(false);

      // Delay closing selectors until after bets re-render
      setTimeout(() => {
        closeAllBetSelectors();
      }, 0);

      showSuccess("Betslip saved.");
    } catch (error) {
      console.error("Error saving bets:", error.response || error);
      showError("Failed to save bets.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.headingContainer}>
        <View style={s.titleContainer}>
          <Txt style={s.title}>Betslip</Txt>
          {/* <Animated.View style={arrowStyle}>
            <FontAwesome6 name="chevron-up" size={16} color="#F8F8F8" />
          </Animated.View> */}
        </View>
        <View style={s.btnContainer}>
          <Btn
            btnText={"Save"}
            fontSize={14}
            style={s.btn}
            isEnabled={hasChanges && !isSubmitting}
            onPress={handleSaveBets} // Call the handleSubmitBets function when pressed
          />
        </View>
      </View>

      <View style={s.payoutContainer}>
        <Txt style={s.payoutHeading}>Max Payout</Txt>
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
    paddingBottom: 12,
    // backgroundColor: "#184EAD",
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
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
  payoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#0F2638",
  },
  payoutHeading: {
    // color: "#061826",
    textTransform: "uppercase",
    fontFamily: "Saira_600SemiBold",
    // fontSize: 14
  },
  payoutText: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 18,
  },
});
