import {
	View,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Animated,
	Dimensions,
	Alert,
  FlatList,
} from "react-native";
import {
	router,
	useFocusEffect,
	useLocalSearchParams,
	useNavigation,
} from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/general/Txt";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { SpreadAndOUInstructions } from "@/components/bet_instructions/SpreadAndOUInstructions/SpreadAndOUInstructions.jsx";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { GAME_DATA } from "@/utils/game-data.js";
import { BetSlip } from "@/components/BetSlip/BetSlip.jsx";
import React, { useEffect, useRef, useState } from "react";
import {
	BetProvider,
	useBetContext,
} from "../../../../../../components/contexts/BetContext";
import { LoadingIndicator } from "../../../../../../components/general/LoadingIndicator";
import api from "../../../../../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BudgetRow } from "../../../../../../components/BetSelection/BudgetRow";
import { ConfirmLeaveBetSelectionModal } from "../../../../../../components/BetSelection/ConfirmLeaveBetSelectionModal";
import { useToastMessage } from "../../../../../../hooks/useToastMessage";
import { useSeason } from "../../../../../../components/contexts/SeasonContext";
import { useConferences } from "../../../../../../hooks/useConferences";
import { ConferenceFilter } from "../../../../../../components/GameCard/ConferenceFilter";

export default function BattleDetails() {
	const {
		id: poolId,
		leagueSeasonId,
		battleId,
		betslipId,
	} = useLocalSearchParams();

	const {
		selectedConferences,
		toggleConference,
		clearConferences,
		filterGames,
		FILTER_CONFERENCES,
	} = useConferences();

	const { showError, showSuccess } = useToastMessage();
	const [isBetSlipShown, setIsBetSlipShown] = useState(true);
	const [betslipHasChanges, setBetslipHasChanges] = useState(false);
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showLeaveModal, setShowLeaveModal] = useState(false);
	const [suppressLeaveModal, setSuppressLeaveModal] = useState(false);
	const suppressLeaveModalRef = useRef(false);
	const { currentSeason, loading: seasonLoading } = useSeason();

	const scrollViewRef = useRef(null);
	const sheetRef = useRef(null);
	const pendingNavEvent = useRef(null);
	const navigation = useNavigation();

	const { bets, storeBets, loadBets } = useBetContext(); // Access context function

	const closeBetSlip = () => {
		sheetRef.current?.collapse(); // or .close() if you want to hide it completely
		setIsBetSlipShown(false);
	};

	// useEffect to trigger fetching games and loading bets on mount
	useEffect(() => {
		const initializeBattleData = async () => {
			setLoading(true);

			try {
				const [gamesRes, battleRes] = await Promise.all([
					api.get(`/games`, {
						params: {
							week: currentSeason.current_week,
							season_year: currentSeason.year,
						},
					}),
					api.get(
						`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}`
					),
				]);

				const battle = battleRes.data;
				// const betslip = betslipRes.data;

				if (battle.locked) {
					showError("Battle is locked. Redirected to the pool.");
					router.replace(`/pools/${poolId}`);
					return;
				}

				setGames(gamesRes.data);
				await loadBets(poolId, leagueSeasonId, battleId, betslipId, true);
			} catch (error) {
				console.error("Error initializing battle data:", error);
			}

			setLoading(false);
		};

		initializeBattleData();
	}, [currentSeason, battleId]);

	// useEffect to store bets in AsyncStorage whenever they change
	useEffect(() => {
		const storeUpdatedBets = async () => {
			if (bets.length > 0) {
				await storeBets(battleId, bets);
			} else {
				console.log(`No bets to store for battle ${battleId}`);
				await AsyncStorage.removeItem(`bets-${battleId}`);
			}
		};

		storeUpdatedBets();
	}, [bets, battleId]);

	useFocusEffect(
		React.useCallback(() => {
			suppressLeaveModalRef.current = false; // ✅ reset on screen focus

			const beforeRemove = (e) => {
				if (suppressLeaveModalRef.current || !betslipHasChanges) return;

				e.preventDefault();
				pendingNavEvent.current = e; // Store the navigation event
				setShowLeaveModal(true); // Show custom modal
			};

			const unsubscribe = navigation.addListener("beforeRemove", beforeRemove);
			return () => unsubscribe();
		}, [betslipHasChanges, navigation])
	);

	const filteredGames = filterGames(games);

	// function renderGameCards() {
	// 	return filteredGames.map((game) => (
	// 		<View key={game.id}>
	// 			<GameCard game={game} type={"betSelection"} />
	// 		</View>
	// 	));
	// }

	return (
		<SafeAreaProvider>
			<SafeAreaView style={s.container}>
				{loading || seasonLoading ? (
					<View style={s.loadingContainer}>
						<LoadingIndicator color="light" contentToLoad="games" />
					</View>
				) : (
					<>
						<View style={s.body}>
							<BudgetRow
								isBetSlipShown={isBetSlipShown}
								scrollViewRef={scrollViewRef}
								closeBetSlip={closeBetSlip}
							></BudgetRow>
							<View style={s.conferenceFilterContainer}>
								<ConferenceFilter
									selected={selectedConferences}
									onToggle={toggleConference}
									onClear={clearConferences}
									conferences={FILTER_CONFERENCES}
								/>
							</View>
							{/* <View style={{height: .5, backgroundColor: '#425C70', marginHorizontal: -8, marginTop: 8,}}/> */}
							<FlatList
								ref={scrollViewRef}
								data={filteredGames}
								keyExtractor={(g) => g.id.toString()}
								contentContainerStyle={{ padding: 4, paddingBottom: 108 }}
								renderItem={({ item: game }) => (
									<View key={game.id}>
										<GameCard game={game} type="betSelection" />
									</View>
								)}
								// optional perf tweaks:
								initialNumToRender={10}
								windowSize={5}
								removeClippedSubviews
							/>
						</View>
						<BetSlip
							ref={sheetRef}
							poolId={poolId}
							isBetSlipShown={isBetSlipShown}
							setIsBetSlipShown={setIsBetSlipShown}
							scrollViewRef={scrollViewRef}
							leagueSeasonId={leagueSeasonId}
							betslipId={betslipId}
							battleId={battleId}
							betslipHasChanges={betslipHasChanges}
							setBetslipHasChanges={setBetslipHasChanges}
							setSuppressLeaveModal={() =>
								(suppressLeaveModalRef.current = true)
							}
						/>
						{showLeaveModal && (
							<ConfirmLeaveBetSelectionModal
								visible={showLeaveModal}
								onCancel={() => setShowLeaveModal(false)}
								onConfirm={() => {
									setShowLeaveModal(false);
									navigation.dispatch(pendingNavEvent.current.data.action);
								}}
							/>
						)}
					</>
				)}
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
		paddingHorizontal: 4,
		paddingTop: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	scrollView: {
		padding: 4,
	},
	logoHeader: {
		paddingBottom: 8,
	},
	body: {
		flex: 1,
		paddingHorizontal: 4,
		// marginBottom:
	},
	conferenceFilterContainer: {
		paddingVertical: 8,
	},
});
