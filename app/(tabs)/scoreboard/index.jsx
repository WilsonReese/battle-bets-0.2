import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { ConferenceFilter } from "../../../components/GameCard/ConferenceFilter";
import { useSeason } from "../../../components/contexts/SeasonContext";
import { useConferences } from "../../../hooks/useConferences";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import { useBetContext } from "../../../components/contexts/BetContext";
import api from "../../../utils/axiosConfig";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";
import sampleGame from "@/utils/sampleGame.json";
import sampleTeamStats from "@/utils/sampleTeamStats.json";
import samplePlayerStats from "@/utils/samplePlayerStats.json";
import axios from "axios";

export default function Scoreboard() {
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
		userBetsByGame,
		setUserBetsByGame,
		setUserPoolCountByGame,
		gameStatus,
	} = useScoreboard();

	const { getUserBetsByGame } = useBetContext();
	const router = useRouter();

	const [games, setGames] = useState([]);
	const [loadingGames, setLoadingGames] = useState(true);

	const filteredGames = React.useMemo(
		() => filterGames(games),
		[games, selectedConferences]
	);

	const handlePress = (game) => {
		router.push(`/scoreboard/${game.id}`);
	};

	useFocusEffect(
		useCallback(() => {
			const fetchGames = async () => {
				if (!currentSeason) return;

				setLoadingGames(true);

				try {
					const res = await api.get("/games", {
						params: {
							week: currentSeason.current_week,
							season_year: currentSeason.year,
						},
					});

					setGames(res.data);
				} catch (err) {
					console.error("Failed to load games:", err);
				} finally {
					setLoadingGames(false);
				}
			};

			fetchGames();
		}, [currentSeason])
	);

	useEffect(() => {
		const fetchAllUserBets = async () => {
			const betsMap = {};
			const poolCountMap = {};

			for (const game of filteredGames) {
				// const { bets, poolCount } = await getUserBetsByGame(game.id);
				// betsMap[game.id] = bets;
				// poolCountMap[game.id] = poolCount;
				const { bets, poolCount } = await getUserBetsByGame(game.id);
				betsMap[game.id] = bets;
				poolCountMap[game.id] = poolCount;
			}

			setUserBetsByGame(betsMap);
			setUserPoolCountByGame(poolCountMap);
		};

		fetchAllUserBets();
	}, [games, getUserBetsByGame, setUserBetsByGame, setUserPoolCountByGame]);

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
			<ScrollView showsVerticalScrollIndicator={false}>
				{filteredGames.length === 0 ? (
					<Txt>No games found for this week.</Txt>
				) : (
					filteredGames.map((game) => (
						<ScoreboardGameCard
							key={game.id}
							game={game}
							status={gameStatus}
							sampleGameData={sampleGameData}
							userBets={userBetsByGame[game.id] || []}
							onPress={() => handlePress(game)}
						/>
					))
				)}
			</ScrollView>
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
