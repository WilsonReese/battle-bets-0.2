import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { Txt } from "../../../components/general/Txt";
import api from "../../../utils/axiosConfig";
import { useSeason } from "../../../components/contexts/SeasonContext";
import { useFocusEffect, useRouter } from "expo-router";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { GameCard } from "../../../components/GameCard/GameCard";
import { ConferenceFilter } from "../../../components/GameCard/ConferenceFilter";
import { useConferences } from "../../../hooks/useConferences";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import sampleGame from "@/utils/sampleGame.json";
import sampleTeamStats from "@/utils/sampleTeamStats.json";
import samplePlayerStats from "@/utils/samplePlayerStats.json";
import axios from "axios";
import { useBetContext } from "../../../components/contexts/BetContext";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";

export default function Scoreboard() {
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
	// const gameStatus = "inProgress"

	const { currentSeason, loading: seasonLoading } = useSeason();
	const {
		setSelectedGame,
		setSelectedGameData,
		setSelectedHomeTeamStats,
		setSelectedAwayTeamStats,
		setSelectedHomePlayerStats,
		setSelectedAwayPlayerStats,
		setUserBets,
		gameStatus,
    userBetsByGame,
		setUserBetsByGame,
		setUserPoolCountByGame,
	} = useScoreboard();
	const { getUserBetsByGame } = useBetContext();
	const router = useRouter();
	const [games, setGames] = useState([]);
	const [loadingGames, setLoadingGames] = useState(true);
	// const [userBetsByGame, setUserBetsByGame] = useState({});
	// const [userPoolCount, setUserPoolCount] = useState({});

	const filteredGames = filterGames(games);

	const handlePress = (game) => {
		setSelectedGame(game);
		setSelectedGameData(sampleGameData);
		setSelectedHomeTeamStats(sampleHomeTeamStats);
		setSelectedAwayTeamStats(sampleAwayTeamStats);
		setSelectedHomePlayerStats(sampleHomePlayerStats);
		setSelectedAwayPlayerStats(sampleAwayPlayerStats);
		// setUserBets(userBetsByGame);
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

	// console.log("Games: ", games);

	if (seasonLoading || loadingGames) {
		return (
			<View style={s.container}>
				<LoadingIndicator color="light" contentToLoad="scoreboard" />
			</View>
		);
	}

	return (
		<View style={s.container}>
			{/* Games */}
			<View style={s.conferenceFilterContainer}>
				<ConferenceFilter
					selected={selectedConferences}
					onToggle={toggleConference}
					onClear={clearConferences}
					conferences={FILTER_CONFERENCES}
				/>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				{games.length === 0 ? (
					<Txt>No games found for this week.</Txt>
				) : (
					<>
						{filteredGames.map((game) => (
							<ScoreboardGameCard
								key={game.id}
								game={game}
								type={"scoreboard"}
								onPress={handlePress}
								sampleGameData={sampleGameData}
								status={gameStatus}
								userBets={userBetsByGame[game.id] || []}
							/>
						))}
					</>
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
		backgroundColor: "#061826",
		justifyContent: "center",
		alignItems: "center",
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
