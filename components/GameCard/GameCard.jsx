// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import { Datetime } from "./Datetime/Datetime";
// import { Matchup } from "./Matchup/Matchup";
// import { BetOptions } from "./BetOptions";
// import { Txt } from "../general/Txt";
// import { ScoreboardGameCard } from "./Scoreboard/ScoreboardGameCard";


// export function GameCard({
// 	game,
// 	type,
// 	onPress,
// 	sampleGameData,
// 	status,
// 	userBets,
// }) {

// 	{
// 		console.log("Game:", game);
// 	}
// 	{
// 		console.log("User Bets:", userBets);
// 	}

// 	return (
// 		// Game Card
// 		<>
// 			{type === "betSelection" && (
// 				<View style={s.card}>
// 					<View style={{ height: 4 }} />
// 					<View>
// 						<Matchup
// 							homeTeam={game.home_team.name}
// 							awayTeam={game.away_team.name}
// 						/>
// 						<BetOptions game={game} />
// 					</View>
// 				</View>
// 			)}
// 			{type === "scoreboard" && (
// 				<TouchableOpacity
// 					style={s.card}
// 					onPress={() => onPress(game)}
// 					disabled={status === "pregame" ? true : false}
// 				>
// 					<View style={{ height: 4 }} />
// 					<ScoreboardGameCard
// 						game={game}
// 						sampleGameData={sampleGameData}
// 						userBets={userBets}
// 					/>
// 					{userBets.length > 0 && (
// 						<View style={s.userBetCount}>
// 							<Txt style={s.userBetCountTxt}>
// 								{userBets.length} {userBets.length === 1 ? "Bet" : "Bets"}
// 							</Txt>
// 						</View>
// 					)}
// 				</TouchableOpacity>
// 			)}
// 		</>
// 	);
// }

// const s = StyleSheet.create({
// 	card: {
// 		backgroundColor: "#0F2638",
// 		marginVertical: 4,
// 		borderRadius: 8,
// 		paddingHorizontal: 8,
// 		paddingVertical: 4,
// 	},
// 	gameDetails: {
// 		flexDirection: "row",
// 		justifyContent: "flex",
// 	},
// 	userBetCount: {
// 		position: "absolute",
// 		top: 4,
// 		right: 4,
// 		// paddingVertical: -1,
// 		paddingHorizontal: 8,
// 		backgroundColor: "#54D18C",
// 		borderRadius: 6,
// 	},
// 	userBetCountTxt: {
// 		fontSize: 12,
// 	},
// });
