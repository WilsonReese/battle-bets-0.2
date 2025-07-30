import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	View,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	FlatList,
	RefreshControl,
	AppState,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { ConferenceFilter } from "../../../components/GameCard/ConferenceFilter";
import { useSeason } from "../../../components/contexts/SeasonContext";
import { useConferences } from "../../../hooks/useConferences";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import api from "../../../utils/axiosConfig";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";
import sampleGame from "@/utils/sampleGame.json";
import sampleTeamStats from "@/utils/sampleTeamStats.json";
import samplePlayerStats from "@/utils/samplePlayerStats.json";
import axios from "axios";

export default function Scoreboard() {
	const [refreshing, setRefreshing] = useState(false);
	const [games, setGames] = useState([]);
	const [loadingGames, setLoadingGames] = useState(true);
	const router = useRouter();
	// const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
	const appState = useRef(AppState.currentState);

	const {
		currentSeason,
		loading: seasonLoading,
		refresh: refreshSeason,
	} = useSeason();
	const {
		selectedConferences,
		toggleConference,
		clearConferences,
		filterGames,
		FILTER_CONFERENCES,
	} = useConferences();

	const {
		setSelectedGame,
		setSelectedGameData,
		setSelectedHomeTeamStats,
		setSelectedAwayTeamStats,
		setSelectedHomePlayerStats,
		setSelectedAwayPlayerStats,
		setUserBets,
		gameStatus,
	} = useScoreboard();

	console.log("Current Season:", currentSeason);

	const sampleGameData = sampleGame.response[0];
	const sampleHomeTeamStats = sampleTeamStats.response[0]; // this is just one team's data, need to get both
	const sampleAwayTeamStats = sampleTeamStats.response[1];
	const sampleHomePlayerStats = samplePlayerStats.response[0];
	const sampleAwayPlayerStats = samplePlayerStats.response[1];

	const fetchGameData = useCallback(
    async (opts = {}) => {
      const { 
        league = 2, 
        season = currentSeason.year, 
        date, 
        page 
      } = opts;

      try {
        const res = await api.get("/api/v1/api_sports/games", {
          params: { league, season, date, page },
        });
        console.log("🔍 API‑Sports IO data:", res.data);
      } catch (err) {
        console.error("❌ Failed to fetch API‑Sports IO data:", err);
      }
    },
    [api, currentSeason]
  );



	const handlePress = (game) => {
		setSelectedGame(game);
		setSelectedGameData(sampleGameData);
		setSelectedHomeTeamStats(sampleHomeTeamStats);
		setSelectedAwayTeamStats(sampleAwayTeamStats);
		setSelectedHomePlayerStats(sampleHomePlayerStats);
		setSelectedAwayPlayerStats(sampleAwayPlayerStats);
		router.push(`/scoreboard/${game.id}`);
	};

	// Refetch logic now abstracted and shared
	const fetchGames = useCallback(
		async ({ showRefreshControl = false } = {}) => {
			if (!currentSeason) return;

			if (showRefreshControl) setRefreshing(true);

			const week =
				currentSeason.current_week === 0 ? 1 : currentSeason.current_week;

			console.log("Season and Week Passed:", currentSeason.year, week);

			try {
				const res = await api.get("/games", {
					params: {
						week: week,
						season_year: currentSeason.year,
					},
				});
				setGames(res.data);
				// setHasLoadedOnce(true);
			} catch (err) {
				console.error("Failed to load games:", err);
			} finally {
				setLoadingGames(false);
				if (showRefreshControl) setRefreshing(false);
			}
		},
		// [api, currentSeason, hasLoadedOnce]
		[api, currentSeason]
	);

	// console.log('Games:', games)

	const fetchGamesRef = useRef(fetchGames);
	useEffect(() => {
		fetchGamesRef.current = fetchGames;
	}, [fetchGames]);

	// Refresh on focus
	useFocusEffect(
		React.useCallback(() => {
			let isActive = true;
			(async () => {
				await refreshSeason({ silent: true });
				if (!isActive) return;
				await fetchGamesRef.current();
			})();
			return () => {
				isActive = false;
			};
		}, []) // <<–– empty deps so we only re‑register on mount
	);

	// Refresh on pull gesture
	const onRefresh = async () => {
		setRefreshing(true);
		// 1️⃣ reload season (so you pick up a new week if it rolled)
		await refreshSeason({ silent: true });
		// 2️⃣ then reload games for whatever the new currentSeason.current_week is
		await fetchGames({ showRefreshControl: true });
		setRefreshing(false);
	};

	// Reload screen when opening app
	useFocusEffect(
		useCallback(() => {
			const sub = AppState.addEventListener("change", (nextAppState) => {
				if (
					appState.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					// Pools is focused AND app just came foreground → refresh
					onRefresh();
				}
				appState.current = nextAppState;
			});
			return () => sub.remove();
		}, [onRefresh])
	);

	// 	useEffect(() => {
  //   if (currentSeason) {
  //     fetchGameData();
  //   }
  // }, []);

	const filteredGames = React.useMemo(
		() => filterGames(games),
		[games, selectedConferences]
	);

	const renderGame = useCallback(
		({ item: game }) => (
			<ScoreboardGameCard
				game={game}
				status={gameStatus}
				sampleGameData={sampleGameData}
				userBetCount={game.user_bet_count}
				onPress={() => handlePress(game)}
			/>
		),
		[gameStatus, sampleGameData]
	);

	if (seasonLoading || loadingGames) {
		return (
			<View style={s.loadingContainer}>
				<LoadingIndicator color="light" contentToLoad="scoreboard" />
			</View>
		);
	}

	return (
		<View style={s.container}>
			<View style={s.conferenceFilterContainer}>
				<ConferenceFilter
					selected={selectedConferences}
					onToggle={toggleConference}
					onClear={clearConferences}
					conferences={FILTER_CONFERENCES}
				/>
			</View>
			<FlatList
				data={filteredGames}
				keyExtractor={(game) => game.id.toString()}
				renderItem={renderGame}
				initialNumToRender={10}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 16,
				}}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#C7CDD1"
					/>
				}
				ListEmptyComponent={
					<Txt style={{ textAlign: "center", paddingTop: 8 }}>
						No games found for this week.
					</Txt>
				}
			/>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
		padding: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#061826",
	},
	conferenceFilterContainer: {
		paddingBottom: 8,
	},
	gameCard: {
		backgroundColor: "#061826",
		padding: 12,
		borderRadius: 8,
		marginBottom: 12,
		borderWidth: 1,
	},
});
