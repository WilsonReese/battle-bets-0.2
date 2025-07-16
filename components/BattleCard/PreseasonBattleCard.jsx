import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { CountdownTimer } from "./CountdownTimer";

export function PreseasonBattleCard({ leagueStartDateTime }) {
	return (
		<View style={s.container}>
			<View style={s.countdownContainer}>
				<Txt style={s.countdownHeadingTxt}>Bets Open</Txt>
				<CountdownTimer targetDate={leagueStartDateTime} version="large" />
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		// flex: 1,
		// alignItems: "center",
		// alignSelf: "stretch",
		// borderWidth: 1,
		// borderColor: "#3A454D",
		borderRadius: 8,
		paddingTop: 8,
		paddingBottom: 12,
		paddingHorizontal: 12,
		backgroundColor: "#0F2638",
		marginBottom: 8,
	},
	countdownContainer: {
		flex: 1,
		// paddingRight: 24,
	},
	countdownHeadingTxt: {
		// color: "#061826",
		// fontFamily: "Saira_300Light",
		letterSpacing: 2,
		fontSize: 12,
		textTransform: "uppercase",
		color: "#B8C3CC",
		paddingTop: 8,
		alignSelf: "center",
    // backgroundColor: 'green'
	},
});
