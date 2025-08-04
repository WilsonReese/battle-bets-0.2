import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	ScrollView,
	StyleSheet,
	Pressable,
	TouchableWithoutFeedback,
	Dimensions,
} from "react-native";
import { Txt } from "../general/Txt";
// import Checkbox from "expo-checkbox"; // or whichever checkbox component you prefer
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { PolicyModal } from "./PolicyModal";

export function UserAgreement({
	privacyAccepted,
	setPrivacyAccepted,
	termsAccepted,
	setTermsAccepted,
}) {
	const [modalContent, setModalContent] = useState(null); // "privacy" | "terms" | null

	return (
		<View style={s.container}>
			{/* Privacy */}
			<View style={s.row}>
				<TouchableOpacity
					style={s.checkboxContainer}
					onPress={() => setPrivacyAccepted((prev) => !prev)}
				>
					<View style={s.checkbox}>
						{privacyAccepted && (
							<FontAwesome6 name="check" size={16} color="#54D18C" />
							// <View style={{height: 14, width: 14, backgroundColor: '#54D18C', borderRadius: 4,}}/>
						)}
					</View>
				</TouchableOpacity>
				<Txt style={s.label}>
					I hereby acknowledge that I have read and agree to the{" "}
					<Txt style={s.link} onPress={() => setModalContent("privacy")}>
						Privacy Policy
					</Txt>
					.
				</Txt>
			</View>

			{/* Terms */}
			<View style={s.row}>
				<TouchableOpacity
					style={s.checkboxContainer}
					onPress={() => setTermsAccepted((prev) => !prev)}
				>
					<View style={s.checkbox}>
						{termsAccepted && (
							<FontAwesome6 name="check" size={16} color="#54D18C" />
						)}
					</View>
				</TouchableOpacity>
				<Txt style={s.label}>
					I hereby acknowledge that I have read and agree to the{" "}
					<Txt style={s.link} onPress={() => setModalContent("terms")}>
						Terms & Conditions
					</Txt>
					.
				</Txt>
			</View>

			<PolicyModal modalContent={modalContent} setModalContent={setModalContent}/>
		</View>
	);
}

const s = StyleSheet.create({
	container: { paddingVertical: 16 },
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 8,
	},
	// checkbox: { marginTop: 4 },
	label: {
		flex: 1,
		fontSize: 14,
		color: "#C7CDD1",
		lineHeight: 20,
		fontFamily: "Saira_400Regular_Italic",
	},
	link: {
		color: "#54D18C",
		textDecorationLine: "underline",
	},
	button: {
		marginTop: 24,
		backgroundColor: "#0066CC",
		paddingVertical: 12,
		borderRadius: 4,
		alignItems: "center",
	},
	buttonDisabled: {
		backgroundColor: "#CCC",
	},
	buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },

	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: "#061826",
		borderRadius: 9,
		// padding: 20,
		// paddingBottom: 8,
		// width: "80%",
		paddingBottom: 16,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 16,
	},
	closeModalContainer: {
		// backgroundColor: "green",
		paddingVertical: 20,
		paddingRight: 16,
		paddingLeft: 16,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	modalClose: {
		color: "#0066CC",
		fontSize: 16,
	},
	modalBody: {
		// backgroundColor: "#FFF"
	},

	checkboxContainer: {
		paddingVertical: 12,
		paddingRight: 16,
		paddingLeft: 4,
		// backgroundColor: 'green'
	},

	checkbox: {
		borderRadius: 4,
		backgroundColor: "#F8F8F8",
		height: 20,
		width: 20,
		alignItems: "center",
		justifyContent: "center",
		// padding: 8,
	},
});
