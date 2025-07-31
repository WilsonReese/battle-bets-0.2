import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
	AppState,
} from "react-native";
import { Txt } from "../../../components/general/Txt";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";
import {
	BoxScoreModeToggle,
	BoxScoreOrBetsToggle,
} from "../../../components/BoxScore/BoxScoreOrBetsToggle";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { useFocusEffect } from "expo-router";
import {
	isCancelled,
	isFinished,
	isInProgress,
	isNotStarted,
	isPostponed,
} from "../../../utils/gameStatus";

export default function GameDetails() {
	const {
		selectedGame,
		selectedGameData,
		gameStatus,
		// userBetsByGame,
		// userPoolCountByGame
	} = useScoreboard();

	const gameId = selectedGameData?.game?.id;
	const awayTeam = selectedGame.away_team;
	const homeTeam = selectedGame.home_team;
	const bottomSheetRef = useRef(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [awayTeamStats, setAwayTeamStats] = useState([]);
	const [homeTeamStats, setHomeTeamStats] = useState([]);
	const [awayPlayerStats, setAwayPlayerStats] = useState([]);
	const [homePlayerStats, setHomePlayerStats] = useState([]);
	const [loading, setLoading] = useState(true);
	const appState = useRef(AppState.currentState);
	const hasLoadedOnce = useRef(false);
	const lastFocus = useRef(0);

	const screenHeight = Dimensions.get("window").height;
	const bottomSheetHeight = screenHeight * 0.4;

	// console.log("Selected Game Data:", selectedGameData);

	const fetchStats = useCallback(
		async (gameId) => {
			// setLoading(true);
			try {
				// kick off both requests in parallel
				const [teamRes, playerRes] = await Promise.all([
					// const [playerRes] = await Promise.all([
					api.get("/api/v1/api_sports/game_statistics/teams", {
						params: { id: gameId },
					}),
					api.get("/api/v1/api_sports/game_statistics/players", {
						params: { id: gameId },
					}),
				]);

				// teamRes.data is an array [ homeTeamObj, awayTeamObj ]
				const [homeTeamObj, awayTeamObj] = teamRes.data;
				setHomeTeamStats(homeTeamObj);
				setAwayTeamStats(awayTeamObj);
				console.log("✅ Set Team Stats");

				// playerRes.data is an array of { team: { id,… }, statistics: […] } for every player
				const allPlayers = playerRes.data;
				// split players by the matching team.id
				const homePla = allPlayers.filter(
					(p) => p.team.id === selectedGameData.teams.home.id
				);
				const awayPla = allPlayers.filter(
					(p) => p.team.id === selectedGameData.teams.away.id
				);
				setHomePlayerStats(homePla[0]);
				setAwayPlayerStats(awayPla[0]);
				console.log("✅ Set Player Stats");
			} catch (err) {
				console.error("❌ Failed to fetch combined stats:", err);
			} finally {
				setLoading(false);
			}
		},
		[api]
	);

	const updateStats = useCallback(
		async ({ pull = false } = {}) => {
			if (pull) setRefreshing(true);
			else setLoading(true);

			await fetchStats(gameId);

			if (pull) setRefreshing(false);
			else {
				setLoading(false);
				hasLoadedOnce.current = true; // now mark that we’ve loaded at least once
			}
		},
		[fetchStats, gameId]
	);

	useFocusEffect(
		useCallback(() => {
			const now = Date.now();
			if (now - lastFocus.current < 500) return;
			lastFocus.current = now;

			console.log("on screen focus (silent)");
			// directly fetch without touching refreshing/loading flags:
			fetchStats(gameId);
		}, [fetchStats, gameId])
	);

	// 3️⃣ on app background→foreground
	useFocusEffect(
		useCallback(() => {
			const sub = AppState.addEventListener("change", (next) => {
				if (
					appState.current.match(/inactive|background/) &&
					next === "active"
				) {
					console.log("on app state");
					updateStats({ pull: true });
				}
				appState.current = next;
			});
			return () => sub.remove();
		}, [updateStats])
	);

	// 4️⃣ pull-to-refresh
	const onRefresh = useCallback(async () => {
		console.log("on refresh");
		await updateStats({ pull: true });
		try {
			const res = await api.get("/pools");
			setPools(res.data);
			if (!selectedPool && res.data.length > 0) {
				setPool(res.data[0]); // reset to default if needed
			}
			setRefreshKey((k) => k + 1);
		} catch (err) {
			console.error("Error refreshing pools:", err);
		}
	}, [updateStats]);

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

	/* ---------- handlers passed down ---------- */
	const handleSelectPool = (pool) => {
		setPool(pool);
		bottomSheetRef.current?.close();
	};

	// Box Score or Bets Toggle
	const [infoMode, setInfoMode] = useState("boxScore");

	// Selected Team for Box Score Toggle
	const [selectedTeam, setSelectedTeam] = useState(awayTeam.name); // makes it default to the away team being selected

	const [selectedBetGroup, setSelectedBetGroup] = useState("Your Bets");

	if (loading) {
		return (
			<View style={s.loadingContainer}>
				<LoadingIndicator color="light" contentToLoad="stats" />
			</View>
		);
	}

	return (
		// Macro Game Data
		<>
			<View style={s.container}>
				<View style={[s.macroGameCard]}>
					<ScoreboardGameCard
						game={selectedGame}
						gameData={selectedGameData}
						gameStatus={gameStatus}
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
								{/* NEED TO DO: Get game status working */}
								{isInProgress(gameStatus) || isFinished(gameStatus) ? (
									<>
										<TeamData
											awayStats={awayTeamStats.statistics}
											homeStats={homeTeamStats.statistics}
											selectedTeam={selectedTeam}
											awayTeamName={awayTeam.name}
											homeTeamName={homeTeam.name}
										/>

										{/* Player Stats */}
										{selectedTeam === awayTeam.name && (
											<PlayerData stats={awayPlayerStats.groups} />
										)}
										{selectedTeam === homeTeam.name && (
											<PlayerData stats={homePlayerStats.groups} />
										)}
									</>
								) : (
									<Txt style={{ alignSelf: "center", paddingTop: 16 }}>
										{isNotStarted(gameStatus) &&
											"Check back when the game starts!"}
										{isPostponed(gameStatus) &&
											"This game has been postponed."}
										{isCancelled(gameStatus) &&
											"This game has been canceled. Any bets placed on this game will be void."}
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
									<UserBetsForGame
										selectedGame={selectedGame}
										refreshKey={refreshKey}
									/>
								)}

								{/* League Bets */}
								{selectedBetGroup === "League Bets" && (
									<LeagueBetsForGame
										gameId={selectedGame.id}
										pools={pools}
										selectedPool={selectedPool}
										battlesLocked={selectedGame.battles_locked}
										refreshKey={refreshKey}
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#061826",
	},
});
