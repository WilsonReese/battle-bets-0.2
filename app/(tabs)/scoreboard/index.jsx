import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	FlatList,
	RefreshControl,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { ConferenceFilter } from "../../../components/GameCard/ConferenceFilter";
import { useSeason } from "../../../components/contexts/SeasonContext";
import { useConferences } from "../../../hooks/useConferences";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import { useBetOps } from "../../../components/contexts/BetContext";
import api from "../../../utils/axiosConfig";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";
import sampleGame from "@/utils/sampleGame.json";
import sampleTeamStats from "@/utils/sampleTeamStats.json";
import samplePlayerStats from "@/utils/samplePlayerStats.json";
import axios from "axios";

export default function Scoreboard() {
	const [refreshing, setRefreshing] = useState(false);
	// const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

	const { currentSeason, loading: seasonLoading } = useSeason();
	const {
		selectedConferences,
		toggleConference,
		clearConferences,
		filterGames,
		FILTER_CONFERENCES,
	} = useConferences();

	const sampleGameData = sampleGame.response[0];
	const sampleHomeTeamStats = sampleTeamStats.response[0]; // this is just one team's data, need to get both
	const sampleAwayTeamStats = sampleTeamStats.response[1];
	const sampleHomePlayerStats = samplePlayerStats.response[0];
	const sampleAwayPlayerStats = samplePlayerStats.response[1];

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

	const router = useRouter();

	const [games, setGames] = useState([]);
	const [loadingGames, setLoadingGames] = useState(true);

	const filteredGames = React.useMemo(
		() => filterGames(games),
		[games, selectedConferences]
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

			// 1️⃣  Show full-screen spinner only the *first* time
			// if (!hasLoadedOnce) setLoadingGames(true);

			// 2️⃣  Show the list-header spinner only on user pull
			if (showRefreshControl) setRefreshing(true);

			try {
				const res = await api.get("/games", {
					params: {
						week: currentSeason.current_week,
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

	// Refresh on focus
	useFocusEffect(
		useCallback(() => {
			fetchGames(); // default showRefreshControl = false
		}, [fetchGames])
	);

	// Refresh on pull gesture
	const onRefresh = () => {
		fetchGames({ showRefreshControl: true });
	};

	console.log("Games:", games);

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
				ListEmptyComponent={<Txt style={{textAlign: 'center', paddingTop: 8,}}>No games found for this week.</Txt>}
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
