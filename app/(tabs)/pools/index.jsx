import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	RefreshControl,
	ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { StatusBar } from "expo-status-bar";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
// import { useAxiosWithAuth } from "../../../utils/axiosConfig";
import { Btn } from "../../../components/general/Buttons/Btn";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { NoLeagues } from "../../../components/PoolCard/NoLeagues";
import api from "../../../utils/axiosConfig";

export default function Pools() {
	// const api = useAxiosWithAuth();
	const [pools, setPools] = useState([]);
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [autoRefreshing, setAutoRefreshing] = useState(false);
	const autoRefreshTimer = useRef(null);

	// 🆕 this counter bumps every time the screen gains focus
	// const [focusVersion, setFocusVersion] = useState(0);

	// ─────────────────────────────────────────────
	// Fetch list of pools
	// ─────────────────────────────────────────────
	const fetchPools = async () => {
		try {
			const res = await api.get("/pools");
			setPools(res.data);
		} catch (err) {
			console.error("Error fetching pools:", err);
		}
	};

	// Initial
	useFocusEffect(
		useCallback(() => {
			let isActive = true;
			setIsScreenLoading(true);
			fetchPools().finally(() => {
				if (isActive) setIsScreenLoading(false);
			});
			return () => {
				isActive = false; // cleanup to prevent setting state after unmount
			};
		}, []) // remove [api] dependency to prevent refiring
	);

	// Pull-to-refresh for Reload every time.
	// const onRefresh = async () => {
	// 	setRefreshing(true);
	// 	await fetchPools();
	// 	setRefreshing(false);
	// 	// setFocusVersion(v => v + 1);      // ⬆️  force cards to refetch too
	// };

	// const resetAutoRefreshTimer = () => {
	// 	if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current);
	// 	autoRefreshTimer.current = setInterval(() => {
	// 		console.log("⏱ Auto-refreshing pools...");
	// 		onRefresh(true);
	// 	}, 60000); // 60 seconds
	// };

	useFocusEffect(
		useCallback(() => {
			console.log("✅ Pools screen focused — starting auto-refresh");
			autoRefreshTimer.current = setInterval(() => {
				console.log("⏱ Auto-refreshing pools...");
				onRefresh(true);
			}, 60000); // 60 seconds

			return () => {
				console.log("🔁 Pools screen unfocused — clearing auto-refresh");
				clearInterval(autoRefreshTimer.current);
			};
		}, [onRefresh])
	);

	// const onRefresh = useCallback(async (isAuto = false) => {
	// 	if (isAuto) {
	// 		setAutoRefreshing(true);
	// 	} else {
	// 		setRefreshing(true);
	// 		resetAutoRefreshTimer(); // 💡 Reset timer only after manual refresh
	// 	}

	// 	await fetchPools();

	// 	if (isAuto) {
	// 		setAutoRefreshing(false);
	// 	} else {
	// 		setRefreshing(false);
	// 	}
	// }, []);

	const onRefresh = useCallback(
		async (isAuto = false) => {
			if (isAuto) {
				setAutoRefreshing(true);
			} else {
				setRefreshing(true);

				// 🧠 Reset auto-refresh timer after manual refresh
				if (autoRefreshTimer.current) {
					clearInterval(autoRefreshTimer.current);
					autoRefreshTimer.current = setInterval(() => {
						console.log("⏱ Auto-refreshing pools...");
						onRefresh(true);
					}, 60000); // after manually refreshing, timer is set back to 60 seconds
				}
			}

			await fetchPools();

			if (isAuto) {
				setAutoRefreshing(false);
			} else {
				setRefreshing(false);
			}
		},
		[api]
	);

	// useEffect(() => {
	// 	resetAutoRefreshTimer(); // start the first timer on mount
	// 	return () => clearInterval(autoRefreshTimer.current); // cleanup
	// }, []);

	if (isScreenLoading) {
		return (
			<View style={s.container}>
				<LoadingIndicator color="light" contentToLoad="pools" />
			</View>
		);
	}

	return (
		<View style={s.container}>
			<StatusBar style="light" />

			<View style={s.titleContainer}>
				<Txt style={s.titleText}>Leagues</Txt>
				{autoRefreshing && (
					<View style={{ paddingRight: 8 }}>
						<ActivityIndicator size="small" hidesWhenStopped />
					</View>
				)}
			</View>

			{pools.length === 0 ? (
				<NoLeagues />
			) : (
				<FlatList
					data={pools}
					keyExtractor={(item) => item.id.toString()}
					// renderItem={({ item }) => (
					// 	<PoolCard pool={item} focusVersion={focusVersion} />
					// )}
					renderItem={({ item }) => (
						<PoolCard
							pool={item}
							refreshing={refreshing}
							autoRefreshing={autoRefreshing}
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
