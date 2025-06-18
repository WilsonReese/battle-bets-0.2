import { View, StyleSheet, ScrollView } from "react-native";
import { Txt } from "../../../components/general/Txt";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";
import {
	BoxScoreModeToggle,
	BoxScoreOrBetsToggle,
} from "../../../components/BoxScore/BoxScoreOrBetsToggle";
import { useState } from "react";
import { DataToggle } from "../../../components/BoxScore/DataToggle";
import { TeamData } from "../../../components/BoxScore/TeamData";
import { PlayerData } from "../../../components/BoxScore/PlayerData";
import { useBetContext } from "../../../components/contexts/BetContext";
import { BetDetails } from "../../../components/BetSlip/BetDetails";
import { UserBetsForGame } from "../../../components/BoxScore/UserBetsForGame";

export default function GameDetails() {
	const {
		selectedGame,
		selectedGameData,
		selectedHomeTeamStats,
		selectedAwayTeamStats,
		selectedHomePlayerStats,
		selectedAwayPlayerStats,
		userBets,
	} = useScoreboard();
	const awayTeam = selectedGame.away_team;
	const homeTeam = selectedGame.home_team;

	console.log("Selected Game:", selectedGame);
	console.log("User Bets", userBets);

	// Box Score or Bets Toggle
	const [infoMode, setInfoMode] = useState("boxScore");

	// Selected Team for Box Score Toggle
	const [selectedTeam, setSelectedTeam] = useState(awayTeam.name); // makes it default to the away team being selected

	const [selectedBetGroup, setSelectedBetGroup] = useState("Your Bets");

	return (
		// Macro Game Data
		<View style={s.container}>
			<View style={s.macroGameCard}>
				<ScoreboardGameCard
					game={selectedGame}
					sampleGameData={selectedGameData}
					status={"inProgress"}
				/>
			</View>

			{/* Box Score or Bets Toggle */}
			<View>
				<BoxScoreOrBetsToggle selected={infoMode} onSelect={setInfoMode} />
			</View>

			<ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
				<View style={s.detailsCard}>
					{infoMode === "boxScore" && (
						<>
							<View style={{ alignItems: "center" }}>
								<DataToggle
									optionLeft={awayTeam.name}
									optionRight={homeTeam.name}
									selected={selectedTeam}
									onSelect={setSelectedTeam}
								/>
							</View>

							{/* Team Stats */}
							<TeamData
								awayStats={selectedAwayTeamStats.statistics}
								homeStats={selectedHomeTeamStats.statistics}
								selectedTeam={selectedTeam}
								awayTeamName={awayTeam.name}
								homeTeamName={homeTeam.name}
							/>

							{/* Player Stats */}
							{selectedTeam === awayTeam.name && (
								<PlayerData stats={selectedAwayPlayerStats.groups} />
							)}
							{selectedTeam === homeTeam.name && (
								<PlayerData stats={selectedHomePlayerStats.groups} />
							)}
						</>
					)}

					{infoMode === "bets" && (
						<>
							<View style={{ alignItems: "center" }}>
								<DataToggle
									optionLeft={"Your Bets"}
									optionRight={"League Bets"}
									selected={selectedBetGroup}
									onSelect={setSelectedBetGroup}
								/>
							</View>

							{/* User Bets */}
							{selectedBetGroup === "Your Bets" && (
								// <>
								// 	{isSinglePool
								// 		? gameBets.map((bet) => (
								// 				<PlacedBet key={bet.id} bet={bet} />
								// 		  ))
                //       : renderGroupedUserBets()}
								// </>
								<UserBetsForGame userBets={userBets} selectedGame={selectedGame}/>
							)}

							{/* League Bets */}
							{selectedBetGroup === "League Bets" && (
								<Txt>bets from the league</Txt>
							)}
						</>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
		padding: 8,
		// alignItems: 'center'
	},
	macroGameCard: {
		backgroundColor: "#0F2638",
		marginVertical: 4,
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingTop: 8,
		paddingBottom: 4,
	},
	detailsCard: {
		// backgroundColor: "#0F2638",
		marginTop: 8,
		// padding: 4,
		borderRadius: 8,
	},
});
