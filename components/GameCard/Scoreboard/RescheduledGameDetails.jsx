import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { format } from "date-fns";
import { isCancelled, isPostponed } from "../../../utils/gameStatus";

export function RescheduledGameDetails({ gameStatus }) {
  console.log(gameStatus)
	return (
		<View style={s.container}>
			{isCancelled(gameStatus) && (
        <Txt style={s.txt}>Cancelled</Txt>
      )}
      {isPostponed(gameStatus) && (
        <Txt style={s.txt}>Postponed</Txt>
      )}
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
