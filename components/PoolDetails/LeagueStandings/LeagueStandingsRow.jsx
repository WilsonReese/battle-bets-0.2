import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function LeagueStandingsRow({ entry, isLast }) {
	const { currentUserId } = useContext(AuthContext);
	// console.log("Current User?", entry.user.id == );
  // console.log("Current User ID", currentUserId);

	return (
		<>
			<View key={entry.id} style={[s.container, !isLast && s.withBottomBorder]}>
				<View style={s.rank}>
					<Txt style={s.txt}>{entry.ranking}</Txt>
				</View>
				<View style={s.player}>
					<Txt style={[s.txt, s.playerName]}>@{entry.user.username}</Txt>
					{entry.user.id == currentUserId && (
						<FontAwesome6 name="user-large" size={10} color="#54D18C" />
					)}
				</View>
				<View style={s.score}>
					<Txt style={s.txt}>{entry.total_points}</Txt>
				</View>
			</View>
		</>
	);
}

const s = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	txt: {
		color: "#F8F8F8",
		fontSize: 14,
	},
	rank: {
		width: 60,
		// backgroundColor: "green",
		alignItems: "center",
	},
	player: {
		// backgroundColor: "blue",
		flex: 20,
		alignItems: "flex-start",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
	},
	score: {
		width: 80,
		// backgroundColor: "red",
		alignItems: "center",
	},
	withBottomBorder: {
		borderBottomWidth: 0.5,
		borderBottomColor: "#1D394E",
	},
	playerName: {
		fontFamily: "Saira_400Regular_Italic",
	},
});
