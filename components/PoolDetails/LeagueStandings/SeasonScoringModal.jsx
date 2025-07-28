import {
	Dimensions,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { Txt } from "../../general/Txt";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Btn } from "../../general/Buttons/Btn";

export function SeasonScoringModal({
	infoModalVisible,
	setInfoModalVisible,
	leagueSize,
}) {
	const { height: screenHeight } = Dimensions.get("window");
	const maxModalHeight = screenHeight * 0.8;

	return (
		<>
			<Modal transparent={true} animationType="fade" visible={infoModalVisible}>
				<View style={s.overlay}>
					<TouchableWithoutFeedback onPress={() => setInfoModalVisible(false)}>
						<View style={StyleSheet.absoluteFill} />
					</TouchableWithoutFeedback>

					<View style={[s.container, { maxHeight: maxModalHeight }]}>
						<View>
							<FontAwesome6 name="xmark" size={24} color="black" />
						</View>
						<ScrollView>
							<Txt style={s.text}>
								Here’s your scoring info for a league of {leagueSize} teams.
							</Txt>
							{/* …more content… */}
						<Btn
							btnText="Close"
							isEnabled
							onPress={() => setInfoModalVisible(false)}
						/>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</>
	);
}

const s = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		backgroundColor: "#061826",
		borderRadius: 9,
		padding: 20,
		// paddingBottom: 8,
		width: "80%",
	},
});
