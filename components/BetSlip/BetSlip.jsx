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

export const BetSlip = forwardRef(
	(
		{
			poolId,
			isBetSlipShown,
			setIsBetSlipShown,
			scrollViewRef,
			leagueSeasonId,
			betslipId,
			battleId,
			betslipHasChanges,
			setBetslipHasChanges,
			setSuppressLeaveModal,
			setDisableInteraction,
		},
		ref
	) => {
		// const sheetRef = useRef(null);
		const snapPoints = useMemo(() => ["15.5%", "70%"], []);
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
				<>
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
						setSuppressLeaveModal={setSuppressLeaveModal}
						setDisableInteraction={setDisableInteraction}
					/>
					<BottomSheetScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
						<BetSlipDetails />
						{/* <BetSlipDetails toggleBetSlip={toggleBetSlip} /> */}
					</BottomSheetScrollView>
				</>
			</BottomSheet>
		);
	}
);

const s = StyleSheet.create({
	sheetBackground: {
		backgroundColor: "#1D394E",
	},
	handle: {
		backgroundColor: "#F8F8F8",
	},
});
