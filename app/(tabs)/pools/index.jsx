import React, { useCallback, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { StatusBar } from "expo-status-bar";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { useAxiosWithAuth } from "../../../utils/axiosConfig";
import { Btn } from "../../../components/general/Buttons/Btn";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { NoLeagues } from "../../../components/PoolCard/NoLeagues";

export default function Pools() {
	const api = useAxiosWithAuth();
	const [pools, setPools] = useState([]);
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			const fetchPools = async () => {
				setIsScreenLoading(true);
				try {
					const response = await api.get("/pools");
					setPools(response.data);
				} catch (error) {
					console.error("Error fetching pools:", error);
				} finally {
					setIsScreenLoading(false);
				}
			};

			fetchPools();
		}, [api])
	);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const response = await api.get("/pools");
			setPools(response.data);
		} catch (err) {
			console.error("Refresh error:", err);
		} finally {
			setRefreshing(false);
		}
	};

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
			</View>

			{pools.length === 0 ? (
				<NoLeagues />
			) : (
				<FlatList
					data={pools}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => <PoolCard pool={item} refreshing={refreshing}/>}
					showsVerticalScrollIndicator={false}
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
	titleContainer: {},
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
