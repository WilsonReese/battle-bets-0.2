import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
} from "react-native";
import { Txt } from "../../../components/general/Txt";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";
import {
	BoxScoreModeToggle,
	BoxScoreOrBetsToggle,
} from "../../../components/BoxScore/BoxScoreOrBetsToggle";
import { useEffect, useRef, useState } from "react";
import { DataToggle } from "../../../components/BoxScore/DataToggle";
import { TeamData } from "../../../components/BoxScore/TeamData";
import { PlayerData } from "../../../components/BoxScore/PlayerData";
import { BetDetails } from "../../../components/BetSlip/BetDetails";
import { UserBetsForGame } from "../../../components/BoxScore/UserBetsForGame";
import { LeagueBetsForGame } from "../../../components/BoxScore/LeagueBetsForGame";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import api from "../../../utils/axiosConfig";
import { Matchup } from "../../../components/GameCard/Matchup/Matchup";
import { PregameCardDetails } from "../../../components/GameCard/Scoreboard/PregameCardDetails";

export default function GameDetails() {
	const {
		gameStatus,
		selectedGame,
		selectedGameData,
		selectedHomeTeamStats,
		selectedAwayTeamStats,
		selectedHomePlayerStats,
		selectedAwayPlayerStats,
		// userBetsByGame,
		// userPoolCountByGame
	} = useScoreboard();
	const awayTeam = selectedGame.away_team;
	const homeTeam = selectedGame.home_team;
	const bottomSheetRef = useRef(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const screenHeight = Dimensions.get("window").height;
	const bottomSheetHeight = screenHeight * 0.4;

	/* ---------- POOLS ---------- */
	const [pools, setPools] = useState([]);
	const [selectedPool, setPool] = useState(null);

	// fetch pools ONCE
	useEffect(() => {
		api.get("/pools").then((res) => {
			setPools(res.data);
			setPool(res.data[0]); // default
		});
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);

		try {
			const res = await api.get("/pools");
			setPools(res.data);
			if (!selectedPool && res.data.length > 0) {
				setPool(res.data[0]); // reset to default if needed
			}
		} catch (err) {
			console.error("Error refreshing pools:", err);
		} finally {
			setRefreshing(false);
		}
	};

	/* ---------- handlers passed down ---------- */
	const handleSelectPool = (pool) => {
		setPool(pool);
		bottomSheetRef.current?.close();
	};

	console.log("Selected Game:", selectedGame);
	// console.log("User Bets", userBets);

	// Box Score or Bets Toggle
	const [infoMode, setInfoMode] = useState("boxScore");

	// Selected Team for Box Score Toggle
	const [selectedTeam, setSelectedTeam] = useState(awayTeam.name); // makes it default to the away team being selected

	const [selectedBetGroup, setSelectedBetGroup] = useState("Your Bets");

	return (
		// Macro Game Data
		<>
			<View style={s.container}>
				<View style={[s.macroGameCard]}>
					<ScoreboardGameCard
						game={selectedGame}
						sampleGameData={selectedGameData}
					/>
				</View>

				{/* Box Score or Bets Toggle */}
				<View>
					<BoxScoreOrBetsToggle selected={infoMode} onSelect={setInfoMode} />
				</View>

				<ScrollView
					style={s.scrollView}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="#C7CDD1"
						/>
					}
				>
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
								{gameStatus !== "pregame" ? (
									<>
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
								) : (
									<Txt style={{ alignSelf: "center", paddingTop: 16 }}>
										Check back when the game starts!
									</Txt>
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
									<UserBetsForGame selectedGame={selectedGame} />
								)}

								{/* League Bets */}
								{selectedBetGroup === "League Bets" && (
									<LeagueBetsForGame
										gameId={selectedGame.id}
										pools={pools}
										selectedPool={selectedPool}
										battlesLocked={selectedGame.battles_locked}
										onToggleSheet={() => {
											if (sheetOpen) {
												bottomSheetRef.current?.close();
											} else {
												bottomSheetRef.current?.expand();
											}
										}}
									/>
								)}
							</>
						)}
					</View>
				</ScrollView>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					enablePanDownToClose
					snapPoints={[bottomSheetHeight]}
					enableDynamicSizing={false}
					onChange={(index) => setSheetOpen(index >= 0)}
					backgroundStyle={s.sheetBackground}
					handleIndicatorStyle={s.handle}
				>
					<BottomSheetScrollView style={s.sheetContainer}>
						{pools.map((pool) => (
							<TouchableOpacity
								key={pool.id}
								style={s.radioItem}
								onPress={() => handleSelectPool(pool)}
							>
								<View style={s.radioCircle}>
									{selectedPool?.id === pool.id && (
										<View style={s.radioSelected} />
									)}
								</View>
								<Txt style={s.radioLabel}>{pool.name}</Txt>
							</TouchableOpacity>
						))}
					</BottomSheetScrollView>
				</BottomSheet>
			</View>
		</>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
		padding: 8,
		// alignItems: 'center'
	},
	pregameCard: {
		// paddingBottom: 4,
		height: 84,
		flexDirection: "row",
		justifyContent: "space-between",
		// paddingRight: 4,
		backgroundColor: "#0F2638",
		marginVertical: 6,
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
	macroGameCard: {
		backgroundColor: "#0F2638",
		marginBottoml: 4,
		borderRadius: 8,
		// paddingHorizontal: 8,
		// paddingTop: 8,
		// paddingBottom: 4,
	},
	detailsCard: {
		// backgroundColor: "#0F2638",
		marginTop: 8,
		// padding: 4,
		borderRadius: 8,
	},
	sheetBackground: {
		backgroundColor: "#1D394E",
	},
	handle: {
		backgroundColor: "#F8F8F8",
	},
	sheetContainer: {
		padding: 16,
	},
	radioItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
	},
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#F8F8F8",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	radioSelected: {
		height: 10,
		width: 10,
		borderRadius: 5,
		backgroundColor: "#F8F8F8",
	},
	radioLabel: {
		fontSize: 16,
		color: "#F8F8F8",
	},
});
