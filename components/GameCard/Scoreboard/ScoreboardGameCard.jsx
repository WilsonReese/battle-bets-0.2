import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Matchup } from "../Matchup/Matchup";
import { PregameCardDetails } from "./PregameCardDetails";
import { BoxScoreGameCard } from "./BoxScoreGameCard";
import { RescheduledGameDetails } from "./RescheduledGameDetails";
import {
	categorizeStatus,
	isCancelled,
	isFinished,
	isInProgress,
	isNotStarted,
	isPostponed,
	StatusGroup,
} from "../../../utils/gameStatus";

// NEED TO DO - MAKE SURE GAME STATUS IS CORRECT

function ScoreboardGameCardComponent({
	game,
	gameData,
	gameTimer,
	awayScore,
	homeScore,
	userBetCount,
	gameStatus,
	onPress = () => {},
}) {

	console.log('Game Data on Scoreboard Game Card:', gameData)

	return (
		<TouchableOpacity style={s.card} onPress={() => onPress(game)}>
			<View>
				{isNotStarted(gameStatus) && (
					<View style={s.container}>
						<Matchup
							homeTeam={game.home_team.name}
							awayTeam={game.away_team.name}
							format="scoreboard"
						/>
						<PregameCardDetails game={game} />
					</View>
				)}

				{(isCancelled(gameStatus) || isPostponed(gameStatus)) && (
					<View style={s.container}>
						<Matchup
							homeTeam={game.home_team.name}
							awayTeam={game.away_team.name}
							format="scoreboard"
						/>
						<RescheduledGameDetails gameStatus={gameStatus}/>
					</View>
				)}

				{isInProgress(gameStatus) && (
					<View style={s.container}>
						<BoxScoreGameCard
							game={game}
							gameData={gameData}
							status={gameStatus}
							gameTimer={gameTimer}
							homeScore={homeScore}
							awayScore={awayScore}
						/>
					</View>
				)}

				{isFinished(gameStatus) && (
					<View style={s.container}>
						<BoxScoreGameCard
							game={game}
							gameData={gameData}
							status={gameStatus}
							gameTimer={gameTimer}
							homeScore={homeScore}
							awayScore={awayScore}
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
const areEqual = (prev, next) => {
  return (
    prev.game.id       === next.game.id     &&
    prev.userBetCount  === next.userBetCount&&
    prev.gameStatus    === next.gameStatus  &&
    prev.homeScore     === next.homeScore   &&
    prev.awayScore     === next.awayScore   &&
    prev.gameTimer     === next.gameTimer
  );
};

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
