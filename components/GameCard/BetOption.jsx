import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetOption({ title, payout, isSelected, onPress, isEnabled }) {
	const shadowStyle = isEnabled || isSelected ? s.shadow : null;

  console.log("🔄 Bet Option rendered", title);

	return (
			<Pressable
				style={({ pressed }) => [
					s.optionView,
					isSelected ? s.isSelected : s.isNotSelected,
					pressed && isEnabled && { opacity: 0.5 },
					!isEnabled && !isSelected && s.disabledOption, // Apply disabled style if not selected
					shadowStyle, // Conditionally apply shadow style
				]}
				onPress={isEnabled || isSelected ? onPress : null} // Disable onPress if not enabled and not selected
			>
				<View style={s.betNameContainer}>
					<Txt
						style={[
							s.oddsText,
							isEnabled || isSelected ? null : s.disabledText,
						]}
					>
						{title}
					</Txt>
				</View>
				<View
					style={[s.payout, isEnabled || isSelected ? null : s.disabledOption]}
				>
					<Txt
						style={[
							s.payoutText,
							isEnabled || isSelected ? null : s.disabledText,
						]}
					>
						x{payout}
					</Txt>
				</View>
			</Pressable>
	);
}

const s = StyleSheet.create({
	optionView: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#1D394E",
		borderRadius: 8,
	},
	isNotSelected: {
		marginBottom: 4,
    // backgroundColor: "#1D394E",
	},
	isSelected: {
		backgroundColor: "#425C70",
		borderBottomRightRadius: 8,
		borderBottomLeftRadius: 8,
		paddingBottom: 4,
	},
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	betNameContainer: {
		// flex: 1,
		padding: 8,
    // backgroundColor: "#1D394E",
	},
	oddsText: {
		fontFamily: "Saira_600SemiBold",
		// color: "#061826",
		fontSize: 12,
	},
	payout: {
		backgroundColor: "#425C70",
		borderTopRightRadius: 8,
		borderBottomRightRadius: 8,
		// borderWidth: .5,
		// borderColor: '#54D18C',
		paddingHorizontal: 8,
		justifyContent: "center",
		alignSelf: "stretch",
	},
	payoutText: {
		fontFamily: "Saira_600SemiBold",
		// color: "#061826",
		fontSize: 11,
	},
	disabledOption: {
		backgroundColor: "#1D394E",
	},
	disabledText: {
		color: "#425C70",
	},
});
