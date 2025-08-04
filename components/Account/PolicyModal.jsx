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

export function PolicyModal({ modalContent, setModalContent }) {
	const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
	const maxModalHeight = screenHeight * 0.8;
	const maxModalWidth = screenWidth * 0.9;

	return (
		<>
			{/* Modal */}
			<Modal
				visible={modalContent !== null}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setModalContent(null)}
			>
				<View style={s.overlay}>
					<TouchableWithoutFeedback onPress={() => setModalContent(null)}>
						<View style={StyleSheet.absoluteFill} />
					</TouchableWithoutFeedback>

					<View
						style={[
							s.modalContainer,
							{ maxHeight: maxModalHeight, width: maxModalWidth },
						]}
					>
						{(modalContent === "privacy" || modalContent === "terms") && (
							<View style={s.modalHeader}>
								{modalContent === "privacy" && (
									<Txt style={s.modalTitle}>Privacy Policy</Txt>
								)}

								{modalContent === "terms" && (
									<Txt style={s.modalTitle}>Terms & Conditions</Txt>
								)}

								<TouchableOpacity
									style={s.closeModalContainer}
									onPress={() => setModalContent(null)}
								>
									<FontAwesome6 name="xmark" size={20} color="#F8F8F8" />
								</TouchableOpacity>
							</View>
						)}
            
						<ScrollView
							style={s.modalBody}
							contentContainerStyle={{ padding: 16 }}
						>
							{modalContent === "privacy" && (
								<Txt>
									{/* you can load this from a file, or paste your policy here */}
									[Your full Privacy Policy text goes here…]
								</Txt>
							)}
							{modalContent === "terms" && (
								<Txt>
									{/* likewise */}
									[Your full Terms & Conditions text goes here…]
								</Txt>
							)}
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
});
