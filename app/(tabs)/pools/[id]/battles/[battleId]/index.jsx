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
// import { SpreadAndOUInstructions } from "@/components/bet_instructions/SpreadAndOUInstructions/SpreadAndOUInstructions.jsx";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { GAME_DATA } from "@/utils/game-data.js";
import { BetSlip } from "@/components/BetSlip/BetSlip.jsx";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { LoadingIndicator } from "../../../../../../components/general/LoadingIndicator";
import api from "../../../../../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BudgetRow } from "../../../../../../components/BetSelection/BudgetRow";
import { ConfirmLeaveBetSelectionModal } from "../../../../../../components/BetSelection/ConfirmLeaveBetSelectionModal";
import { useToastMessage } from "../../../../../../hooks/useToastMessage";
import { useSeason } from "../../../../../../components/contexts/SeasonContext";
import { useConferences } from "../../../../../../hooks/useConferences";
import { ConferenceFilter } from "../../../../../../components/GameCard/ConferenceFilter";
import { GamesList } from "../../../../../../components/BetSelection/GamesList";
import { useBetStore } from "../../../../../../state/useBetStore";

export default function BattleDetails() {
	const {
		id: poolId,
		leagueSeasonId,
		battleId,
		openBetslip,
		// betslipId,
	} = useLocalSearchParams();
	const {
		selectedConferences,
		toggleConference,
		clearConferences,
		filterGames,
		FILTER_CONFERENCES,
	} = useConferences();

	// console.log("Battle Details Betslip:", betslipId);

	const { showError, showSuccess } = useToastMessage();
	const { refresh: refreshSeason, loading: seasonLoading } = useSeason();
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showLeaveModal, setShowLeaveModal] = useState(false);
	const suppressLeaveModalRef = useRef(false);
	const [disableInteraction, setDisableInteraction] = useState(false);
	const [poolName, setPoolName] = useState("");
	const [betslipId, setBetslipId] = useState("");
	const [sheetIndex, setSheetIndex] = useState(openBetslip === "true" ? 1 : 0);

	const sheetRef = useRef(null);
	const pendingNavEvent = useRef(null);
	const navigation = useNavigation();

	const hasUnsaved = useBetStore((state) => state.hasUnsavedChanges());

	const loadBets = useBetStore((state) => state.loadBets);

	// useEffect to trigger fetching games and loading bets on mount
	useEffect(() => {
		const initializeBattleData = async () => {
			setLoading(true);

			try {
				const season = await refreshSeason({ silent: true });
				if (!season) throw new Error("Failed to load season");

				const week = season.current_week;

				const [gamesRes, poolsRes, battleRes] = await Promise.all([
					api.get("/games", {
						params: {
							week: week,
							season_year: season.year,
						},
					}),
					api.get(`/pools/${poolId}`),
					api.get(
						`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}`
					),
				]);

				const battle = battleRes.data;
				// console.log('Battle Response:', battle)
				// const betslip = betslipRes.data;

				if (battle.locked) {
					showError("Battle is locked. Redirected to the league.");
					router.replace(`/pools/${poolId}`);
					return;
				}

				setGames(gamesRes.data);
				setPoolName(poolsRes.data.name ?? "");

				const betslipRes = await api.get(
					`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips`,
					{ params: { user_only: true } }
				);
				const slip = betslipRes.data;
				if (!slip || !slip.id) {
					throw new Error("No betslip found for current user.");
				}
				setBetslipId(slip.id);

				await loadBets({
					poolId,
					leagueSeasonId,
					battleId,
					betslipId: slip.id,
					showError,
					forceBackend: false, // set to true if you always want fresh
				});
			} catch (error) {
				console.error("Error initializing battle data:", error);
			} finally {
				setLoading(false);
			}
		};

		initializeBattleData();
	}, [battleId, refreshSeason]);

	useEffect(() => {
		if (!loading && !seasonLoading && openBetslip === "true") {
			sheetRef.current?.snapToIndex(1);
		}
	}, [loading, seasonLoading, openBetslip]);

	// confirm-on-leave when there are unsaved changes
	useFocusEffect(
		React.useCallback(() => {
			// reset suppression flag each time screen gains focus
			suppressLeaveModalRef.current = false;

			const beforeRemove = (e) => {
				if (suppressLeaveModalRef.current || !hasUnsaved) {
					return;
				}
				// stop default behavior of leaving
				e.preventDefault();
				// save the event so we can trigger it later
				pendingNavEvent.current = e;
				// show our custom modal
				setShowLeaveModal(true);
			};

			// subscribe
			const unsub = navigation.addListener("beforeRemove", beforeRemove);
			return () => unsub();
		}, [navigation, hasUnsaved])
	);

	// const filteredGames = filterGames(games);
	const filteredGames = useMemo(
		() => filterGames(games),
		[games, selectedConferences]
	);

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
							<BudgetRow />
							<View style={s.conferenceFilterContainer}>
								<ConferenceFilter
									selected={selectedConferences}
									onToggle={toggleConference}
									onClear={clearConferences}
									conferences={FILTER_CONFERENCES}
								/>
							</View>
							{disableInteraction && (
								<>
									<View style={s.interactionBlocker} pointerEvents="auto">
										<ActivityIndicator size="small" color="#E4E6E7" />
										<Txt style={s.spinnerTxt}>Saving bets</Txt>
									</View>
								</>
							)}
							{/* <View style={{height: .5, backgroundColor: '#425C70', marginHorizontal: -8, marginTop: 8,}}/> */}
							<GamesList games={filteredGames} />
						</View>
						<BetSlip
							ref={sheetRef}
							initialIndex={openBetslip === "true" ? 2 : 0}
							poolId={poolId}
							poolName={poolName}
							leagueSeasonId={leagueSeasonId}
							betslipId={betslipId}
							battleId={battleId}
							setSuppressLeaveModal={() =>
								(suppressLeaveModalRef.current = true)
							}
							setDisableInteraction={setDisableInteraction}
						/>

						{/* confirm‐leave dialog */}
						<ConfirmLeaveBetSelectionModal
							visible={showLeaveModal}
							onCancel={() => setShowLeaveModal(false)}
							onConfirm={() => {
								setShowLeaveModal(false);
								// allow that navigation event to go through
								navigation.dispatch(pendingNavEvent.current.data.action);
							}}
						/>
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

	// Timeout Style
	interactionBlocker: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#061826",
		zIndex: 9999, // ensure it's on top
		opacity: 0.7,
		margin: -12,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	spinnerTxt: {
		paddingTop: 8,
		paddingBottom: 100,
	},
});
