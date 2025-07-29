import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	View,
	StyleSheet,
	FlatList,
	RefreshControl,
	ActivityIndicator,
	TouchableOpacity,
	AppState,
} from "react-native";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { StatusBar } from "expo-status-bar";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
// import { useAxiosWithAuth } from "../../../utils/axiosConfig";
import { Btn } from "../../../components/general/Buttons/Btn";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { NoLeagues } from "../../../components/PoolCard/NoLeagues";
import api from "../../../utils/axiosConfig";
import { AnnouncementsCard } from "../../../components/PoolCard/AnnouncementsCard";
import { HowToPlayModal } from "../../../components/HowToPlay/HowToPlayModal";
import { usePoolStore } from "../../../state/poolStore";

export default function Pools() {
	// const api = useAxiosWithAuth();
	const [pools, setPools] = useState([]);
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	// const [hasLoaded, setHasLoaded] = useState(false);
	const firstLoadRef = useRef(true);
	const [response, setResponse] = useState([]);
	const [showHowToPlay, setShowHowToPlay] = useState(false);
	const [focusVersion, setFocusVersion] = useState(0);

	const navigation = useNavigation();
	const appState = useRef(AppState.currentState);
	const fetchAllPoolData = usePoolStore((state) => state.fetchAllPoolData);

	// 1️⃣  Inject “How to Play” into the header
	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => setShowHowToPlay(true)}
					style={{ paddingVertical: 8 }}
				>
					<Txt style={{ color: "#FFF", fontSize: 12 }}>How to Play</Txt>
				</TouchableOpacity>
			),
		});
	}, [navigation]);

	useFocusEffect(
		useCallback(() => {
			let active = true;
			// 1️⃣ start the spinner
			if (firstLoadRef.current) {
				setIsScreenLoading(true);
			}

			async function loadAll() {
				try {
					// 2a) fetch pools
					const { data: fetchedPools } = await api.get("/pools");
					if (!active) return;
					setPools(fetchedPools);

					// 2b) fetch announcements
					const { data: ann } = await api.get("/announcements");
					if (!active) return;
					setResponse(ann.id ? ann : null);

					// 2c) fetch each pool’s details in parallel
					await Promise.all(
						fetchedPools.map((p) =>
							fetchAllPoolData(p.id, { skipLoading: firstLoadRef.current })
						)
					);
				} catch (err) {
					console.error("Error loading pools + announcements:", err);
				} finally {
					// 3️⃣ always stop the spinner (if we’re still mounted)
					if (active) setIsScreenLoading(false);
					firstLoadRef.current = false;
				}
			}

			loadAll();
			return () => {
				active = false;
			};
		}, [fetchAllPoolData])
	);

	useFocusEffect(
		useCallback(() => {
			const subscription = AppState.addEventListener(
				"change",
				(nextAppState) => {
					// only fire your onRefresh if you’re actually coming back *into* the app
					if (
						appState.current.match(/inactive|background/) &&
						nextAppState === "active"
					) {
						console.log('Re-Opened App')
						onRefresh();
					}
					appState.current = nextAppState;
				}
			);
			return () => {
				subscription.remove();
			};
		}, [onRefresh])
	);

	const onRefresh = useCallback(async () => {
		await Promise.all(
			pools.map((p) => fetchAllPoolData(p.id, { skipLoading: false }))
		);
	}, [pools, fetchAllPoolData]);

	if (isScreenLoading) {
		return (
			<View style={s.container}>
				<LoadingIndicator color="light" contentToLoad="pools" />
			</View>
		);
	}

	return (
		<View style={s.container}>
			{/* <StatusBar style="light" /> */}

			{pools.length === 0 ? (
				<NoLeagues response={response} />
			) : (
				<FlatList
					data={pools}
					keyExtractor={(item) => item.id.toString()}
					// renderItem={({ item }) => (
					// 	<PoolCard pool={item} focusVersion={focusVersion} />
					// )}
					ListHeaderComponent={
						<View>
							{response?.id && <AnnouncementsCard response={response} />}

							<View style={s.titleContainer}>
								<Txt style={s.titleText}>Leagues</Txt>
								{/* {autoRefreshing && (
									<View style={{ paddingRight: 8 }}>
										<ActivityIndicator size="small" hidesWhenStopped />
									</View>
								)} */}
							</View>
						</View>
					}
					renderItem={({ item }) => (
						<PoolCard
							pool={item}
							refreshing={refreshing}
							focusVersion={focusVersion}
							// autoRefreshing={autoRefreshing}
						/>
					)}
					showsVerticalScrollIndicator={false}
					initialNumToRender={5}
					contentContainerStyle={{ paddingBottom: 16 }}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="#C7CDD1"
						/>
					}
				/>
			)}
			<View style={s.createLeagueContainer}>
				<Btn
					btnText="Create a League"
					style={s.btn}
					isEnabled={true}
					onPress={() => router.push(`/pools/create/`)}
				/>
			</View>

			<HowToPlayModal
				showHowToPlay={showHowToPlay}
				setShowHowToPlay={setShowHowToPlay}
			/>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
		backgroundColor: "#061826",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	titleText: {
		color: "#F8F8F8",
		fontSize: 24,
	},
	btn: {
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
	createLeagueContainer: {
		paddingVertical: 12,
	},
});

// import React, {
// 	useCallback,
// 	useEffect,
// 	useLayoutEffect,
// 	useRef,
// 	useState,
// } from "react";
// import {
// 	View,
// 	StyleSheet,
// 	FlatList,
// 	RefreshControl,
// 	ActivityIndicator,
// 	TouchableOpacity,
// } from "react-native";
// import { router, useFocusEffect, useNavigation } from "expo-router";
// import { Txt } from "../../../components/general/Txt";
// import { StatusBar } from "expo-status-bar";
// import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
// // import { useAxiosWithAuth } from "../../../utils/axiosConfig";
// import { Btn } from "../../../components/general/Buttons/Btn";
// import { PoolCard } from "../../../components/PoolCard/PoolCard";
// import { NoLeagues } from "../../../components/PoolCard/NoLeagues";
// import api from "../../../utils/axiosConfig";
// import { AnnouncementsCard } from "../../../components/PoolCard/AnnouncementsCard";
// import { HowToPlayModal } from "../../../components/HowToPlay/HowToPlayModal";

// export default function Pools() {
// 	// const api = useAxiosWithAuth();
// 	const [pools, setPools] = useState([]);
// 	const [isScreenLoading, setIsScreenLoading] = useState(true);
// 	const [refreshing, setRefreshing] = useState(false);
// 	const [autoRefreshing, setAutoRefreshing] = useState(false);
// 	const [response, setResponse] = useState([]);
// 	const [showHowToPlay, setShowHowToPlay] = useState(false);

// 	const navigation = useNavigation();

// 	const autoRefreshTimer = useRef(null);

// 	// 🆕 this counter bumps every time the screen gains focus
// 	// const [focusVersion, setFocusVersion] = useState(0);

// 	// 1️⃣  Inject “How to Play” into the header
// 	useLayoutEffect(() => {
// 		navigation.setOptions({
// 			headerRight: () => (
// 				<TouchableOpacity
// 					onPress={() => setShowHowToPlay(true)}
// 					style={{ paddingVertical: 8 }}
// 				>
// 					<Txt style={{ color: "#FFF", fontSize: 12 }}>How to Play</Txt>
// 				</TouchableOpacity>
// 			),
// 		});
// 	}, [navigation]);

// 	// ─────────────────────────────────────────────
// 	// Fetch list of pools
// 	// ─────────────────────────────────────────────
// 	const fetchPools = async () => {
// 		try {
// 			const res = await api.get("/pools");
// 			setPools(res.data);
// 		} catch (err) {
// 			console.error("Error fetching pools:", err);
// 		}
// 	};

// 	const fetchAnnouncements = async () => {
// 		try {
// 			const res = await api.get("/announcements");
// 			if (res.status === 200 && res.data?.id) {
// 				setResponse(res.data);
// 			} else {
// 				setResponse(null);
// 			}
// 		} catch (err) {
// 			console.warn("Error fetching announcements:", err);
// 			setResponse(null);
// 		}
// 	};

// 	// Initial
// 	useFocusEffect(
// 		useCallback(() => {
// 			let isActive = true;
// 			setIsScreenLoading(true);

// 			Promise.all([fetchAnnouncements(), fetchPools()]).finally(() => {
// 				if (isActive) setIsScreenLoading(false);
// 			});

// 			return () => {
// 				isActive = false;
// 			};
// 		}, [])
// 	);

// 	useFocusEffect(
// 		useCallback(() => {
// 			console.log("✅ Pools screen focused — starting auto-refresh");
// 			autoRefreshTimer.current = setInterval(() => {
// 				console.log("⏱ Auto-refreshing pools...");
// 				onRefresh(true);
// 			}, 60000); // 60 seconds

// 			return () => {
// 				console.log("🔁 Pools screen unfocused — clearing auto-refresh");
// 				clearInterval(autoRefreshTimer.current);
// 			};
// 		}, [onRefresh])
// 	);

// 	const onRefresh = useCallback(
// 		async (isAuto = false) => {
// 			if (isAuto) {
// 				setAutoRefreshing(true);
// 			} else {
// 				setRefreshing(true);

// 				// 🧠 Reset auto-refresh timer after manual refresh
// 				if (autoRefreshTimer.current) {
// 					clearInterval(autoRefreshTimer.current);
// 					autoRefreshTimer.current = setInterval(() => {
// 						console.log("⏱ Auto-refreshing pools...");
// 						onRefresh(true);
// 					}, 60000); // after manually refreshing, timer is set back to 60 seconds
// 				}
// 			}
// 			await Promise.all([fetchAnnouncements(), fetchPools()]);

// 			if (isAuto) {
// 				setAutoRefreshing(false);
// 			} else {
// 				setRefreshing(false);
// 			}
// 		},
// 		[api]
// 	);

// 	if (isScreenLoading) {
// 		return (
// 			<View style={s.container}>
// 				<LoadingIndicator color="light" contentToLoad="pools" />
// 			</View>
// 		);
// 	}

// 	return (
// 		<View style={s.container}>
// 			<StatusBar style="light" />

// 			{pools.length === 0 ? (
// 				<NoLeagues response={response} />
// 			) : (
// 				<FlatList
// 					data={pools}
// 					keyExtractor={(item) => item.id.toString()}
// 					// renderItem={({ item }) => (
// 					// 	<PoolCard pool={item} focusVersion={focusVersion} />
// 					// )}
// 					ListHeaderComponent={
// 						<View>
// 							{response?.id && <AnnouncementsCard response={response} />}

// 							<View style={s.titleContainer}>
// 								<Txt style={s.titleText}>Leagues</Txt>
// 								{autoRefreshing && (
// 									<View style={{ paddingRight: 8 }}>
// 										<ActivityIndicator size="small" hidesWhenStopped />
// 									</View>
// 								)}
// 							</View>
// 						</View>
// 					}
// 					renderItem={({ item }) => (
// 						<PoolCard
// 							pool={item}
// 							refreshing={refreshing}
// 							autoRefreshing={autoRefreshing}
// 						/>
// 					)}
// 					showsVerticalScrollIndicator={false}
// 					initialNumToRender={5}
// 					contentContainerStyle={{ paddingBottom: 16 }}
// 					refreshControl={
// 						<RefreshControl
// 							refreshing={refreshing}
// 							onRefresh={onRefresh}
// 							tintColor="#C7CDD1"
// 						/>
// 					}
// 				/>
// 			)}
// 			<View style={s.createLeagueContainer}>
// 				<Btn
// 					btnText="Create a League"
// 					style={s.btn}
// 					isEnabled={true}
// 					onPress={() => router.push(`/pools/create/`)}
// 				/>
// 			</View>

// 			<HowToPlayModal showHowToPlay={showHowToPlay} setShowHowToPlay={setShowHowToPlay}/>
// 		</View>
// 	);
// }

// const s = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 		backgroundColor: "#061826",
// 	},
// 	titleContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 	},
// 	titleText: {
// 		color: "#F8F8F8",
// 		fontSize: 24,
// 	},
// 	btn: {
// 		paddingVertical: 12,
// 		paddingHorizontal: 12,
// 	},
// 	createLeagueContainer: {
// 		paddingVertical: 12,
// 	},
// });
