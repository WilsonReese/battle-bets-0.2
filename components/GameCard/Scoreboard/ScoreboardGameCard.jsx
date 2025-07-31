import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Matchup } from "../Matchup/Matchup";
import { PregameCardDetails } from "./PregameCardDetails";
import { BoxScoreGameCard } from "./BoxScoreGameCard";
import { RescheduledGameDetails } from "./RescheduledGameDetails";
// import {
//   categorizeStatus,
//   isInProgress,
//   StatusGroup,
// } from "../utils/gameStatus";

// NEED TO DO - MAKE SURE GAME STATUS IS CORRECT

function ScoreboardGameCardComponent({
	game,
	gameData,
	userBetCount,
	gameStatus,
	onPress = () => {},
}) {
	// const gameStatus = "Finished"

	return (
		<TouchableOpacity style={s.card} onPress={() => onPress(game)}>
			<View>
				{gameStatus === "Not Started" && (
					<View style={s.container}>
						<Matchup
							homeTeam={game.home_team.name}
							awayTeam={game.away_team.name}
							format="scoreboard"
						/>
						<PregameCardDetails game={game} />
					</View>
				)}

				{(gameStatus === "Cancelled" || gameStatus === "Postponed") && (
					<View style={s.container}>
						<Matchup
							homeTeam={game.home_team.name}
							awayTeam={game.away_team.name}
							format="scoreboard"
						/>
						<RescheduledGameDetails game={game} gameStatus={gameStatus} />
					</View>
				)}

				{/* {gameStatus === "inProgress" && ( */}
				{gameStatus === "inProgress" && (
					<View style={s.container}>
						<BoxScoreGameCard
							game={game}
							gameData={gameData}
							status="inProgress"
						/>
					</View>
				)}

				{gameStatus === "Finished" && (
					<View style={s.container}>
						<BoxScoreGameCard
							game={game}
							gameData={gameData}
							status={gameData.game.status.long}
						/>
					</View>
				)}
			</View>

			{userBetCount > 0 && game.battles_locked && (
				<View style={s.userBetCount}>
					<Txt style={s.userBetCountTxt}>
						{userBetCount} {userBetCount === 1 ? "Bet" : "Bets"}
					</Txt>
				</View>
			)}
		</TouchableOpacity>
	);
}

// 2) Equality check
const areEqual = (prev, next) =>
	prev.game.id === next.game.id &&
	prev.gameStatus === next.gameStatus &&
	prev.userBetCount === next.userBetCount &&
	(prev.gameData === next.gameData ||
		prev.gameData?.game?.id === next.gameData?.game?.id);

// 3) Wrap in React.memo **and still export as a named export**
export const ScoreboardGameCard = React.memo(
	ScoreboardGameCardComponent,
	areEqual
);

const s = StyleSheet.create({
	card: {
		width: "100%",
		alignSelf: "stretch",
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#0F2638",
		marginVertical: 6,
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
		height: 84,
	},
	userBetCount: {
		position: "absolute",
		top: 10,
		right: 4,
		paddingHorizontal: 8,
		backgroundColor: "#54D18C",
		borderRadius: 6,
	},
	userBetCountTxt: {
		fontSize: 12,
	},
});
