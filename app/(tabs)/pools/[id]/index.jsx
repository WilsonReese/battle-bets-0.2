import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	View,
	StyleSheet,
	SafeAreaView,
	Alert,
	ScrollView,
	TouchableOpacity,
	Modal,
	RefreshControl,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Txt } from "../../../../components/general/Txt.jsx";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingIndicator } from "../../../../components/general/LoadingIndicator.jsx";
import api from "../../../../utils/axiosConfig.js";
import { Leaderboard } from "../../../../components/Leaderboard/Leaderboard.jsx";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { BattleCard } from "../../../../components/BattleCard/BattleCard.jsx";
import { format } from "date-fns";
import { PreviousBattles } from "../../../../components/PreviousBattles/PreviousBattles.jsx";
import { MembershipsTable } from "../../../../components/PoolDetails/MembershipsTable/MembershipsTable.jsx";
import { AuthContext } from "../../../../components/contexts/AuthContext.js";
import { usePoolDetails } from "../../../../components/contexts/PoolDetailsContext.js";
import { LeaveLeagueButton } from "../../../../components/PoolDetails/LeaveLeagueButton/LeaveLeagueButton.jsx";
import { useToastMessage } from "../../../../hooks/useToastMessage.js";
import { InviteUsersButton } from "../../../../components/PoolDetails/InviteUsers/InviteUsersButton.jsx";
import { PaginatedFlatList } from "../../../../components/general/PaginatedFlatList.jsx";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { PoolSelectionModal } from "../../../../components/PoolDetails/PoolSelection/PoolSelectionModal.jsx";
import { LeagueStandingsTable } from "../../../../components/PoolDetails/LeagueStandings/LeagueStandingsTable.jsx";
import { LeagueSettings } from "../../../../components/PoolDetails/LeagueSettings/LeagueSettings.jsx";
import { SkeletonBattleCard } from "../../../../components/BattleCard/SkeletonBattleCard.jsx";
import { PreseasonBattleCard } from "../../../../components/BattleCard/PreseasonBattleCard.jsx";
import { getLeagueWeekStartDateTime } from "../../../../utils/dateUtils.js";

export default function PoolDetails() {
	const { id: poolId } = useLocalSearchParams();
	const [containerWidth, setContainerWidth] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [userPools, setUserPools] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [battleLeaderboardRefresh, setBattleLeaderboardRefresh] = useState(0);

	const {
		poolDetails,
		selectedSeason,
		battles,
		setBattles,
		userBetslip,
		// setUserBetslip,
		memberships,
		setMemberships,
		loading,
		setLoading,
		fetchAllPoolData,
		userBetslipByBattle, // 🆕 add this
		inviteToken,
	} = usePoolDetails(poolId);

	console.log("✅ PoolDetails loaded");

	const { currentUserId } = useContext(AuthContext);
	const userMembership = memberships.find(
		(m) => String(m.user.id) === String(currentUserId)
	);
	const isCurrentUserCommissioner = userMembership?.is_commissioner;

	// console.log("League Start", getLeagueWeekStartDateTime(selectedSeason?.start_week));

	const fetchUserPools = async () => {
		try {
			const response = await api.get("/pools");
			setUserPools(response.data);
		} catch (err) {
			console.error("Error fetching user pools", err.response || err);
		}
	};

	// useEffect(() => {
	//   fetchUserPools();
	// }, []);

	useFocusEffect(
		useCallback(() => {
			if (poolId) fetchAllPoolData(poolId);
		}, [poolId])
	);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			await fetchAllPoolData(poolId, { skipLoading: true });
			setBattleLeaderboardRefresh((v) => v + 1); // ✅ bump to trigger reload
		} catch (err) {
			console.error("Error refreshing pool data", err);
		} finally {
			setRefreshing(false);
		}
	}, [poolId]);

	// if (!pool) {
	// 	return <LoadingIndicator message="Loading pool..." />;
	// }

	// Render loading spinner while data is being fetched
	if (loading) {
		return (
			<SafeAreaProvider style={s.loadingBackground}>
				<SafeAreaView style={s.loadingContainer}>
					<LoadingIndicator color="light" contentToLoad="battles" />
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}

	return (
		<SafeAreaProvider style={s.background}>
			<SafeAreaView
				style={s.container}
				onLayout={(event) => {
					const { width } = event.nativeEvent.layout;
					setContainerWidth(width);
				}}
			>
				<StatusBar style="light" />
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					<TouchableOpacity
						style={s.titleContainer}
						onPress={() => {
							setModalVisible(true);
							fetchUserPools();
						}}
					>
						<Txt style={s.titleText}>
							{/* This will need to become the Pool Name */}
							{poolDetails.name}
						</Txt>
						<FontAwesome6 name="caret-down" size={24} color="#54D18C" />
					</TouchableOpacity>

					{selectedSeason?.hasStarted && battles.length > 0 ? (
						<View style={s.section}>
							<Txt style={s.sectionTitle}>Battles</Txt>
							<PaginatedFlatList
								data={battles.filter((b) => b.status !== "not_started")}
								itemsPerPage={1}
								containerWidth={containerWidth}
								renderItemRow={(battle) => (
									<BattleCard
										key={battle.id}
										// userBetslip={userBetslip}
										userBetslip={userBetslipByBattle?.[battle.id]} // ✅ Use the correct betslip
										poolId={poolId}
										poolName={poolDetails.name}
										season={selectedSeason}
										battle={battle}
										setBattles={setBattles}
										// setUserBetslip={setUserBetslip}
										setLoading={setLoading}
										refreshVersion={battleLeaderboardRefresh} // ✅ new prop
									/>
								)}
							/>
						</View>
					) : (
						selectedSeason &&
						selectedSeason.start_week && (
							<PreseasonBattleCard
								leagueStartDateTime={getLeagueWeekStartDateTime(
									selectedSeason.start_week
								)}
							/>
						)
					)}
					{selectedSeason?.hasStarted > 0 && (
						<View style={s.section}>
							<LeagueStandingsTable
								leagueSeason={selectedSeason}
								poolId={poolId}
								containerWidth={containerWidth}
							/>
						</View>
					)}

					<View style={s.section}>
						<MembershipsTable
							containerWidth={containerWidth}
							memberships={memberships}
							setMemberships={setMemberships}
							poolId={poolId}
							fetchPoolMemberships={() => fetchAllPoolData(poolId)}
							isCurrentUserCommissioner={isCurrentUserCommissioner}
						/>
						<InviteUsersButton
							poolId={poolId}
							inviteToken={poolDetails.invite_token}
						/>
					</View>

					{/* <PreviousBattles battles={battles} /> */}
					<LeagueSettings
						isCurrentUserCommissioner={isCurrentUserCommissioner}
						poolDetails={poolDetails}
						selectedSeason={selectedSeason}
					/>
					<LeaveLeagueButton
						poolId={poolId}
						memberships={memberships}
						currentUserId={currentUserId}
					/>
				</ScrollView>

				<PoolSelectionModal
					modalVisible={modalVisible}
					userPools={userPools}
					setModalVisible={setModalVisible}
					currentPoolId={poolId}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const s = StyleSheet.create({
	loadingBackground: {
		backgroundColor: "#061826",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 8,
		backgroundColor: "#061826",
	},
	background: {
		backgroundColor: "#061826",
	},
	container: {
		justifyContent: "center",
		margin: 8,
		flex: 1,
	},
	titleContainer: {
		// paddingTop: 8,
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		paddingBottom: 12,
	},
	titleText: {
		color: "#F8F8F8",
		fontSize: 24,
	},
	section: {
		paddingBottom: 40,
	},
	sectionTitle: {
		fontSize: 20,
		color: "#F8F8F8",
		marginBottom: 8,
		fontFamily: 'Saira_600SemiBold'
	},
	betslipContainer: {
		// flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	btn: {
		paddingVertical: 4,
		paddingHorizontal: 12,
		// margin: 4,
	},
	txt: {
		// fontFamily: "Saira_300Light",
		color: "#F8F8F8",
		fontSize: 16,
	},
	bottomSheetTxt: {
		color: "#061826",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: "#F8F8F8",
		borderRadius: 9,
		// padding: 20,
		width: "80%",
	},
});
