import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
	FlatList,
} from "react-native";
import { Txt } from "../../../../../../components/general/Txt";
import { useBattleLeaderboard } from "../../../../../../hooks/useBattleLeaderboard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LockedBetslip } from "../../../../../../components/Leaderboard/LockedBetslip";
import { AuthContext } from "../../../../../../components/contexts/AuthContext";
import { formatDate } from "date-fns";
import api from "../../../../../../utils/axiosConfig";

// Leaderboard Row Height
const ITEM_HEIGHT = 40;

export default function BattleLeaderboard() {
	const {
		id: poolId,
		battleId,
		leagueSeasonId,
		poolName,
		battleWeek,
		battleStatus,
		openUserBetslipId,
	} = useLocalSearchParams();

	const screenHeight = Dimensions.get("window").height;
	const bottomSheetHeight = screenHeight * 0.54;
	const [selectedBetslip, setSelectedBetslip] = useState(null);
	const { currentUserId } = useContext(AuthContext);
	const [refreshing, setRefreshing] = useState(false);
	const [battleStatusState, setBattleStatusState] = useState(battleStatus);

	const battleCompleted = battleStatusState === "completed";
	// const totalPointsIncrease = 10;

	const sheetRef = useRef(null);
	const flatListRef = useRef(null);
	const snapPoints = useMemo(() => ["60%"], []);

	const { betslips, refetch } = useBattleLeaderboard(
		poolId,
		leagueSeasonId,
		battleId
	);

	console.log('Selected Betslip:', selectedBetslip)

	// once betslips are back, if openUserBetslipId is set, pick & open
	useEffect(() => {
		if (!betslips.length || !openUserBetslipId) return;

		const targetId = Number(openUserBetslipId);
		const idx = betslips.findIndex((b) => b.id === targetId);
		if (idx >= 0) {
			// 1 - Select the betslip in state
			setSelectedBetslip(betslips[idx]);
			// 2 - scroll
			flatListRef.current?.scrollToIndex({
				index: idx,
				viewPosition: 0, // put it at top
			});
			// 3 - open sheet
			requestAnimationFrame(() => {
				sheetRef.current?.snapToIndex(0);
			});
		}
	}, [betslips, openUserBetslipId]);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			// Refetch betslips
			await refetch();

			// Refetch battle status from backend
			const battleRes = await api.get(
				`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}`
			);
			setBattleStatusState(battleRes.data.status);
		} catch (err) {
			console.error("Error during refresh:", err);
		} finally {
			setRefreshing(false);
		}
	};

	return (
		<View style={s.container}>
			<Txt style={s.pageTitle}>
				{poolName} - Week {battleWeek}
			</Txt>
			<Txt style={s.headingTxt}>Leaderboard</Txt>
			<FlatList
				data={betslips}
				ref={flatListRef}
				keyExtractor={(b) => b.id.toString()}
				// pull‑to‑refresh
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#54D18C"
					/>
				}
				showsVerticalScrollIndicator={false}
				// reserve space for your bottom sheet
				contentContainerStyle={{ paddingBottom: bottomSheetHeight }}
				getItemLayout={(_, index) => ({
					length: ITEM_HEIGHT,
					offset: ITEM_HEIGHT * index,
					index,
				})}
				// render the column headings once, at the top of the list
				ListHeaderComponent={() => (
					<View style={s.leaderboardContainer}>
						<View style={s.leaderboardHeaderRow}>
							<Txt style={[s.headerRowTxt, s.placeColumn]}>{/* empty */}</Txt>
							<Txt style={[s.headerRowTxt, s.playerColumn]}>Player</Txt>
							<Txt style={[s.headerRowTxt, s.column]}>Won</Txt>
							<Txt style={[s.headerRowTxt, s.column]}>Max</Txt>
							<Txt style={[s.headerRowTxt, s.column]}>Hit</Txt>
							<Txt style={[s.headerRowTxt, s.iconColumn]} />
						</View>
					</View>
				)}
				renderItem={({ item: b, index }) => {
					const prev = betslips[index - 1];
					const shouldShowRank = !prev || b.rank !== prev.rank;
					const isMe = b.user_id == currentUserId;
					return (
						<TouchableOpacity
							style={[
								s.leaderboardRow,
								selectedBetslip?.id === b.id && s.selectedRow,
							]}
							onPress={() => {
								if (selectedBetslip?.id === b.id) {
									setSelectedBetslip(null);
									sheetRef.current?.close();
								} else {
									setSelectedBetslip(b);
									requestAnimationFrame(() => sheetRef.current?.snapToIndex(0));
								}
							}}
						>
							<Txt style={[s.placeTxt, s.placeColumn]}>
								{shouldShowRank ? b.rank : ""}
							</Txt>
							<View style={s.playerColumn}>
								<View style={s.playerNameContainer}>
									<Txt
										style={s.playerTxt}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										@{b.name}
									</Txt>
									{isMe && (
										<FontAwesome6 name="user-large" size={10} color="#54D18C" />
									)}
									{battleCompleted && (
										<Txt style={s.seasonScoreTxt}> (+{b.league_points})</Txt>
									)}
								</View>
							</View>
							<Txt style={[s.placeTxt, s.column]}>${b.earnings}</Txt>
							<Txt style={[s.placeTxt, s.column]}>
								${b.max_payout_remaining}
							</Txt>
							<Txt style={[s.placeTxt, s.column]}>
								{b.hitRate != null ? `${b.hitRate}%` : "—"}
							</Txt>
							<View style={s.iconColumn}>
								<FontAwesome6
									name="circle-chevron-right"
									size={14}
									color="#54D18C"
								/>
							</View>
						</TouchableOpacity>
					);
				}}
			/>
			<LockedBetslip
				sheetRef={sheetRef}
				betslip={selectedBetslip}
				maxHeight={bottomSheetHeight}
				onClose={() => setSelectedBetslip(null)}
				battleCompleted={battleCompleted}
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
	pageTitle: {
		fontSize: 20,
		fontFamily: "Saira_600SemiBold",
	},
	headingTxt: {
		// color: "#061826",
		// fontFamily: "Saira_300Light",
		letterSpacing: 2,
		fontSize: 14,
		textTransform: "uppercase",
		color: "#B8C3CC",
		paddingBottom: 8,
		// paddingTop: 8,
		// alignSelf: "center",
	},

	// Leaderboard Table Styling
	leaderboardContainer: {
		flex: 3,
		// backgroundColor: 'red',
		// paddingRight: 12,
	},
	leaderboardHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 0.5,
		borderColor: "#284357",
		// gap: 8,
	},
	headerRowTxt: {
		fontSize: 12,
		fontFamily: "Saira_600SemiBold",
	},
	column: {
		flex: 1.5,
		textAlign: "center",
		// justifyContent: 'center'
		alignItems: "center",
	},
	iconColumn: {
		flex: 0.5,
		alignItems: "center",
		paddingRight: 4,
	},
	placeColumn: {
		flex: 1,
		textAlign: "center",
		// paddingRight: 20,
	},
	playerColumn: {
		flex: 4.5,
		// backgroundColor:'green',
		// overflow: 'hidden'
	},
	playerNameContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
		// flexShrink: 1,
	},
	leaderboardRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: ITEM_HEIGHT,
		// paddingVertical: 8,
		// borderRightWidth: 0.5,
		borderBottomWidth: 0.5,
		borderColor: "#284357",
	},
	selectedRow: {
		backgroundColor: "#1D394E", // or whatever highlight color works with your theme
	},
	placeTxt: {
		// width: 40,
		fontSize: 12,
	},
	playerTxt: {
		// flex: 1,
		fontSize: 13,
		fontFamily: "Saira_600SemiBold",
		// lineHeight: 20,
		flexShrink: 1,
	},
	seasonScoreTxt: {
		fontSize: 12,
		color: "#54D18C",
	},
});
