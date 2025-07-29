import { StyleSheet, View, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Txt } from "../general/Txt";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useBattleLeaderboard } from "../../hooks/useBattleLeaderboard";
import { getOrdinalSuffix } from "../../utils/formatting";
// import { usePoolDetails } from "../contexts/PoolDetailsContext";
import { format } from "date-fns";
import { router } from "expo-router";
import { SkeletonBattleDetails } from "./SkeletonBattleDetails";
import { usePoolStore } from "../../state/poolStore";

export function BattleLockedPoolCard({ userEntry, userBetslip, pool, battle }) {
	const { loading, betslips } = useBattleLeaderboard(
		pool.id,
		battle.league_season_id,
		battle.id
	);

	const { selectedSeason } = usePoolStore(
		(s) =>
			s.pools[pool.id] || {
				selectedSeason: null,
			}
	);

	// const { selectedSeason } = usePoolDetails(pool.id);
	const battleCompleted = battle.status === "completed";
	// const totalPointsIncrease = userBetslip.league_points;

	if (loading) {
		return (
			<View style={{ paddingVertical: 8 }}>
				<SkeletonBattleDetails />
			</View>
		);
	}

	const userRankedBetslip = betslips.find((b) => b.id === userBetslip.id);

	return (
		<View style={s.detailsContainer}>
			<View style={s.overviewContainer}>
				<Txt style={s.sectonHeadingTxt}>Season</Txt>
				<View style={s.infoContainer}>
					<View style={s.infoUnitContainer}>
						<Txt style={s.infoTitleTxt}>Rank:</Txt>
						<Txt style={s.txt}>{userEntry?.ranking || "N/A"}</Txt>
					</View>
					<View style={s.infoUnitContainer}>
						<Txt style={s.infoTitleTxt}>Points:</Txt>
						<Txt style={s.txt}>{userEntry?.total_points || "N/A"}</Txt>
					</View>
				</View>
			</View>

			<View style={s.currentBattleContainer}>
				<Txt style={s.sectonHeadingTxt}>Week {battle.week}</Txt>
				<TouchableOpacity
					style={s.betslipTouchable}
					onPress={() =>
						router.push({
							pathname: `/pools/${pool.id}/battles/${battle.id}/battleLeaderboard`,
							params: {
								leagueSeasonId: selectedSeason.id,
								poolName: pool.name,
								battleWeek: battle.week,
								battleStatus: battle.status,
								openUserBetslipId: userRankedBetslip.id,
							},
						})
					}
				>
					<View style={[s.infoContainer, s.betslipButton]}>
						<View style={s.infoUnitContainer}>
							{/* <Txt style={s.txt}>Rank: {userRankedBetslip?.rank ?? "—"}</Txt> */}
							<Txt style={s.txt}>
								{getOrdinalSuffix(userRankedBetslip?.rank ?? "—")} Place
								{battleCompleted ? (
									<Txt style={s.seasonScoreTxt}>
										{" "}
										(+{userBetslip.league_points})
									</Txt>
								) : (
									""
								)}
							</Txt>
							{/* <View>
                <Txt></Txt>
              </View> */}
							{/* <MaterialCommunityIcons name="podium" size={14} color="#54D18C" /> */}
						</View>
						<View style={[s.infoUnitContainer, s.betslipAmounts]}>
							<Txt style={s.txt}>Won: ${userBetslip.earnings}</Txt>
							<Txt style={s.txt}>Max: ${userBetslip.max_payout_remaining}</Txt>
						</View>
						<View style={s.listIcon}>
							<FontAwesome6 name="list" size={12} color="#54D18C" />
						</View>
					</View>
					{/* <FontAwesome6 name="circle-chevron-right" size={14} color="#54D18C" /> */}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	detailsContainer: {
		flexDirection: "row",
		paddingBottom: 4,
		gap: 8,
	},
	overviewContainer: {
		flex: 1,
	},
	currentBattleContainer: {
		flex: 2,
	},
	infoContainer: {
		paddingVertical: 4,
	},
	infoUnitContainer: {
		flexDirection: "row",
		gap: 4,
		alignItems: "center",
	},
	betslipButton: {
		backgroundColor: "#1D394E",
		paddingHorizontal: 8,
		borderRadius: 8,
	},

	infoTitleTxt: {
		// color: "#061826",
		fontFamily: "Saira_600SemiBold",
		fontSize: 14,
	},

	sectonHeadingTxt: {
		// color: "#061826",
		// fontFamily: "Saira_300Light",
		letterSpacing: 2,
		fontSize: 12,
		textTransform: "uppercase",
		color: "#B8C3CC",
	},
	txt: {
		fontSize: 14,
	},
	betslipTouchable: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	betslipAmounts: {
		gap: 8,
	},
	listIcon: {
		position: "absolute",
		right: 8,
		top: 8,
	},
	seasonScoreTxt: {
		fontSize: "12",
		color: "#54D18C",
	},
});
