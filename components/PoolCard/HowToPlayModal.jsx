

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Txt } from "../general/Txt";

export function HowToPlayModal({ showHowToPlay, setShowHowToPlay}) {
	const { height: screenHeight } = Dimensions.get("window");
	const maxModalHeight = screenHeight * 0.8;

	return (
		<>
			<Modal transparent={true} animationType="fade" visible={showHowToPlay}>
				<View style={s.overlay}>
					<TouchableWithoutFeedback onPress={() => setShowHowToPlay(false)}>
						<View style={StyleSheet.absoluteFill} />
					</TouchableWithoutFeedback>

					<View style={[s.container, { maxHeight: maxModalHeight }]}>
						<ScrollView style={{ padding: 16 }}>
							<Txt style={s.title}>How to play</Txt>
								<Txt style={s.paragraph}>
									Placeholder txt
								</Txt>
						</ScrollView>

            {/* Close Modal */}
						<TouchableOpacity
							style={s.close}
							onPress={() => setShowHowToPlay(false)}
						>
							<FontAwesome6 name="xmark" size={20} color="#425C70" />
						</TouchableOpacity>
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
		// padding: 20,
		// paddingBottom: 8,
		width: "80%",
		paddingBottom: 16,
	},
	title: {
		fontSize: 20,
		paddingBottom: 4,
	},
	heading: {
		fontSize: 18,
		paddingBottom: 4,
		fontFamily: "Saira_600SemiBold",
	},
	paragraph: {
		fontSize: 14,
		paddingBottom: 8,
	},

	close: {
		position: "absolute",
		top: 0,
		right: 0,
		paddingTop: 12,
		paddingRight: 16,
		paddingBottom: 30,
		paddingLeft: 30,
		// backgroundColor: "blue",
	},
});
