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
import { ProgressIndicator } from "./ProgressIndicator";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { Btn } from "../general/Buttons/Btn";
import api from "../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useBetStore } from "../../state/useBetStore";

export function BetSlipHeading({
	poolId,
	leagueSeasonId,
	betslipId,
	battleId,
	setDisableInteraction,
}) {

	const { saveBets, getMaxPayout } = useBetStore();

	const hasUnsaved = useBetStore((s) => s.hasUnsavedChanges());
	const maxPayout = getMaxPayout();

	const [isSubmitting, setIsSubmitting] = useState(false); // isSubmitting is not currently being used
	const { showError, showSuccess } = useToastMessage();

	const handleSaveBets = async () => {
		setIsSubmitting(true);
		setDisableInteraction(true);

		const result = await saveBets({
			poolId,
			leagueSeasonId,
			battleId,
			betslipId,
			showError,
			showSuccess,
		});

		if (result.status === "success") {
			// setBetslipHasChanges(false);
			// no more toRemove / snapshot is reset inside saveBets
			// closeAllBetSelectors();
		}
		// handle locked or error as before…

		setDisableInteraction(false);
		setIsSubmitting(false);
	};

	return (
		<View style={s.container}>
			<View style={s.headingContainer}>
				<View style={s.titleContainer}>
					<Txt style={s.title}>Betslip</Txt>
				</View>
				<View style={s.btnContainer}>
					<Btn
						btnText={"Save"}
						fontSize={14}
						style={s.btn}
						isEnabled={hasUnsaved && !isSubmitting}
						// isEnabled={true}
						onPress={handleSaveBets} // Call the handleSubmitBets function when pressed
					/>
				</View>
			</View>

			<View style={s.payoutContainer}>
				<Txt style={s.payoutHeading}>Max Payout</Txt>
				{/* <Txt style={s.payoutText}>${calculateTotalPayout()}</Txt> */}
				<Txt style={s.payoutText}>${maxPayout}</Txt>
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
