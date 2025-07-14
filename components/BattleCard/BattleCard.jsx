import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { Leaderboard } from "../Leaderboard/Leaderboard";
import { format } from "date-fns";
import api from "../../utils/axiosConfig";
import { router } from "expo-router";
import { StatusIcon } from "../general/StatusIcon";
import { CreatedBetslipBattleCard } from "./CreatedBetslipBattleCard";
import { usePoolDetails } from "../contexts/PoolDetailsContext";
import { CountdownTimer } from "./CountdownTimer";
import { UnlockedBattleCard } from "./UnlockedBattleCard";
import { LockedBattleCard } from "./LockedBattleCard";

export function BattleCard({
	userBetslip,
	poolId,
	season,
	battle,
	poolName,
	setBattles,
	// setUserBetslip,
	setLoading,
	refreshVersion,
}) {
	const battleEndDate = format(new Date(battle.end_date), "MMMM d");
	const battleEndDateTime = new Date(battle.end_date);
	battleEndDateTime.setHours(10, 55, 0, 0); // Hard Coded: Set to 10:55 AM

	const { memberships } = usePoolDetails(poolId);

	const totalMembers = memberships.length;
	const filledOutBetslips = battle.filled_out_betslip_count;
	const participationRate =
		totalMembers > 0 ? (filledOutBetslips / totalMembers) * 100 : 0;

	const handleEditBets = () => {
		if (!userBetslip) {
			Alert.alert("No betslip found", "Please refresh or try again.");
			return;
		}

		router.push({
			pathname: `/pools/${poolId}/battles/${battle.id}`,
			params: {
				betslipId: userBetslip.id,
				leagueSeasonId: battle.league_season_id,
			},
		});
	};

	const handleViewLeaderboard = () => {
		router.push({
			pathname: `/pools/${poolId}/battles/${battle.id}/battleLeaderboard`,
			params: {
				leagueSeasonId: season.id,
				poolName,
				battleWeek: battle.week,
				battleStatus: battle.status,
			},
		});
	};

	const handleViewUserBetslip = () => {
		if (!userBetslip) {
			Alert.alert("No betslip found", "Please refresh or try again.");
			return;
		}
		router.push({
			pathname: `/pools/${poolId}/battles/${battle.id}/battleLeaderboard`,
			params: {
				leagueSeasonId: season.id,
				poolName,
				battleWeek: battle.week,
				battleStatus: battle.status,
				openUserBetslipId: userBetslip.id, // ← pass the ID
			},
		});
	};

	if (battle.status === "not_started") {
		return null; // Do not render anything
	}

	return (
		// OnPress will need to be adjusted to account for when we aren't editing bets anymore

		<View style={s.container}>
			<View style={s.headingContainer}>
				<Txt style={s.headingTxt}>Week {battle.week}</Txt>
				<Txt style={s.txt}>
					League Participation: {participationRate.toFixed(0)}%
				</Txt>
				{/* <Txt>{battle.current ? 'true' : 'false'}</Txt> */}
			</View>

			{/* === BATTLE IN PROGRESS === */}
			{battle.status === "in_progress" && (
				<>
					{/* Betslip has not been created */}
					{!userBetslip && (
						<View>
							<Txt>No betslip</Txt>
						</View>
					)}

					{/* Betslip has not been filled out yet and the battle isn't locked */}
					{!userBetslip.locked && (
						<UnlockedBattleCard
							battle={battle}
							handleEditBets={handleEditBets}
							battleEndDateTime={battleEndDateTime}
							userBetslip={userBetslip}
						/>
					)}

					{/* Betslip locked */}
					{userBetslip.locked && (
						<LockedBattleCard
							userBetslip={userBetslip}
							battle={battle}
							poolId={poolId}
							refreshVersion={refreshVersion}
							handleViewLeaderboard={handleViewLeaderboard}
							handleViewUserBetslip={handleViewUserBetslip}
						/>
					)}
				</>
			)}

			{/* === COMPLETED === */}
			{battle.status === "completed" && (
				<View>
					{/* <Txt style={s.txtItalic}>Battle Complete</Txt> */}
					<LockedBattleCard
						userBetslip={userBetslip}
						battle={battle}
						poolId={poolId}
						refreshVersion={refreshVersion}
						handleViewLeaderboard={handleViewLeaderboard}
						handleViewUserBetslip={handleViewUserBetslip}
					/>
				</View>
			)}
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		// flex: 1,
		// alignItems: "center",
		// alignSelf: "stretch",
		// borderWidth: 1,
		// borderColor: "#3A454D",
		borderRadius: 8,
		// paddingTop: 8,
		paddingBottom: 8,
		paddingHorizontal: 4,
		// backgroundColor: "#0F2638",
		flex: 1,
	},
	btnContainer: {
		paddingTop: 8,
	},
	btn: {
		paddingVertical: 4,
		paddingHorizontal: 12,
		// margin: 4,
	},
	headingContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// backgroundColor: 'green'
		// paddingBottom: 4,
	},
	headingTxt: {
		// color: "#061826",
		fontFamily: "Saira_600SemiBold",
		// letterSpacing: "2%",
		fontSize: 20,
		// textTransform: "uppercase"
	},
	txt: {
		// fontFamily: "Saira_300Light",
		// color: "#061826",
		fontSize: 12,
	},
	txtItalic: {
		fontFamily: "Saira_400Regular_Italic",
		// color: "#061826",
		fontSize: 14,
		// textAlign: "center",
	},
	notSubmittedIndicatorContainer: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
		paddingTop: 4,
	},
	submitBetsNoticeContainer: {
		alignItems: "center",
	},
});
