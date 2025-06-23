import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Matchup } from "../Matchup/Matchup";
import { PregameCardDetails } from "./PregameCardDetails";
import { BoxScoreGameCard } from "./BoxScoreGameCard";
import { useScoreboard } from "../../contexts/ScoreboardContext";

export function ScoreboardGameCard({ game, sampleGameData, status, userBets }) {
	const { gameStatus } = useScoreboard();

	return (
		<TouchableOpacity
			style={s.card}
			onPress={() => onPress(game)}
			disabled={status === "pregame" ? true : false}
		>
			{/* <View style={{ height: 4 }} /> */}
			<View>
				{/* Show the details for the pre-game of the card */}
				{gameStatus === "pregame" && (
					<View style={s.container}>
						<Matchup
							homeTeam={game.home_team.name}
							awayTeam={game.away_team.name}
							format={"scoreboard"}
						/>
						<PregameCardDetails game={game} />
					</View>
				)}

				{gameStatus === "inProgress" && (
					<View style={s.container}>
						<BoxScoreGameCard
							game={game}
							sampleGameData={sampleGameData}
							status={"inProgress"}
						/>
					</View>
				)}

				{gameStatus === "postgame" && (
					<View style={s.container}>
						<BoxScoreGameCard
							game={game}
							sampleGameData={sampleGameData}
							status={sampleGameData.game.status.long}
						/>
					</View>
				)}
			</View>
			{userBets.length > 0 && (
				<View style={s.userBetCount}>
					<Txt style={s.userBetCountTxt}>
						{userBets.length} {userBets.length === 1 ? "Bet" : "Bets"}
					</Txt>
				</View>
			)}
		</TouchableOpacity>
	);
}

const s = StyleSheet.create({
	container: {
		// paddingBottom: 4,
		flexDirection: "row",
		justifyContent: "space-between",
		// paddingRight: 4,

    backgroundColor: "#0F2638",
		marginVertical: 6,
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
	userBetCount: {
		position: "absolute",
		top: 10,
		right: 4,
		// paddingVertical: -1,
		paddingHorizontal: 8,
		backgroundColor: "#54D18C",
		borderRadius: 6,
	},
	userBetCountTxt: {
		fontSize: 12,
	},
});
