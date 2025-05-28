import React, { forwardRef, useMemo, useRef } from "react";
import {
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import { BetSlipHeading } from "./BetSlipHeading";
import { BetSlipDetails } from "./BetSlipDetails";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export const BetSlip = forwardRef(({
  poolId,
  isBetSlipShown,
  setIsBetSlipShown,
  scrollViewRef,
  leagueSeasonId,
  betslipId,
  battleId,
  betslipHasChanges,
  setBetslipHasChanges,
}, ref) => {
  // const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["15.5%", "80%"], []);
  const screenHeight = Dimensions.get("window").height;

  return (
    <BottomSheet
      ref={ref}
      index={0} // Start partially open
      snapPoints={snapPoints}
      maxDynamicContentSize={screenHeight * 0.4}
      onClose={() => setIsBetSlipShown(false)}
      onChange={(index) => setIsBetSlipShown(index !== -1)}
      backgroundStyle={s.sheetBackground}
      handleIndicatorStyle={s.handle}
    >
      <BottomSheetView>
        <BetSlipHeading
          poolId={poolId}
          isBetSlipShown={isBetSlipShown}
          // toggleBetSlip={toggleBetSlip}
          scrollViewRef={scrollViewRef}
          leagueSeasonId={leagueSeasonId}
          betslipId={betslipId}
          battleId={battleId}
          betslipHasChanges={betslipHasChanges}
          setBetslipHasChanges={setBetslipHasChanges}
        />
      </BottomSheetView>
      <BottomSheetScrollView
        contentContainerStyle={s.content}
      >
        {/* <BetSlipDetails toggleBetSlip={toggleBetSlip} /> */}
        <BetSlipDetails />
      </BottomSheetScrollView>
    </BottomSheet>
  );
})

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
  sheetBackground: {
    backgroundColor: '#1D394E',
  },
  handle: {
    backgroundColor: '#F8F8F8'
  },
});
