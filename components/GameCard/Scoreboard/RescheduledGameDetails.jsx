import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { format } from "date-fns";

export function RescheduledGameDetails({ game, gameStatus }) {
	return (
		<View style={s.container}>
			<Txt style={s.txt}>{gameStatus}</Txt>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		// flexDirection: 'row',
		// gap: 8,
		alignItems: "flex-end",
		justifyContent: "center",
		paddingTop: 4,
		// paddingBottom: 6,
	},
	txt: {
		fontFamily: "Saira_600SemiBold",
		fontSize: 12,
		color: "#C7CDD1",
	},
});
