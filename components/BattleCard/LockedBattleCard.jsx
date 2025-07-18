import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";
import { StatusIcon } from "../general/StatusIcon";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useBattleLeaderboard } from "../../hooks/useBattleLeaderboard";
import { getOrdinalSuffix } from "../../utils/formatting";
import { SkeletonBattleCard } from "./SkeletonBattleCard";
import { TeamLogo } from "../GameCard/Matchup/TeamLogo";
import { PlacedBet } from "../Leaderboard/PlacedBet";

export function LockedBattleCard({
	battle,
	battleEndDateTime,
	userBetslip,
	poolId,
	refreshVersion,
	handleViewLeaderboard,
	handleViewUserBetslip,
}) {
	const { loading, betslips } = useBattleLeaderboard(
		poolId,
		battle.league_season_id,
		battle.id,
		refreshVersion
	);
	const topThree = betslips.slice(0, 3);

	// const { getBudgetForBattle } = useBets();
	// const remaining = getBudgetForBattle(battle.id);
	const userRankedBetslip = betslips.find((b) => b.id === userBetslip.id);
	const battleCompleted = battle.status === "completed";

	function getTopBet(bets) {
		if (!Array.isArray(bets) || bets.length === 0) return null;

		// 1) If any bets have a positive amount_won, pick the largest
		const winningBets = bets
			.map((b) => ({ ...b, amount_won: Number(b.amount_won) }))
			.filter((b) => !isNaN(b.amount_won) && b.amount_won > 0);

		if (winningBets.length) {
			return winningBets.reduce((best, b) =>
				b.amount_won > best.amount_won ? b : best
			);
		}

		// 2) Otherwise look at the pending bets and pick by to_win_amount
		const pending = bets
			.map((b) => ({ ...b, to_win_amount: Number(b.to_win_amount) }))
			.filter((b) => isNaN(b.amount_won) || b.amount_won == null);

		if (pending.length) {
			return pending.reduce((best, b) =>
				b.to_win_amount > best.to_win_amount ? b : best
			);
		}

		// 3) No winners, no pendings
		return null;
	}

	const topBet = getTopBet(userBetslip.bets);

	if (loading) {
		return <SkeletonBattleCard />;
	}

	return (
		<View style={s.container}>
			{/* Leaderboard section */}
			<TouchableOpacity
				style={s.leaderboardContainer}
				onPress={() => handleViewLeaderboard()}
			>
				<View style={s.cardSectionHeading}>
					<Txt style={s.headingTxt}>Leaderboard</Txt>
					<View style={s.actionButton}>
						<Txt style={{ fontSize: 11, color: "#C7CDD1" }}></Txt>
						<FontAwesome6 name="list" size={10} color="#54D18C" />
					</View>
				</View>
				<View style={s.leaderboardHeaderRow}>
					<Txt style={[s.headerRowTxt, s.placeColumn]}> </Txt>
					<Txt style={[s.headerRowTxt, s.playerColumn]}>Player</Txt>
					<Txt style={[s.headerRowTxt, s.column]}>Won</Txt>
					<Txt style={[s.headerRowTxt, s.column]}>Max</Txt>
				</View>
				{topThree.map((b, index) => {
					const prev = topThree[index - 1];
					const shouldShowRank = !prev || b.rank !== prev.rank;

					return (
						<View key={b.id} style={s.leaderboardRow}>
							<Txt style={[s.placeTxt, s.placeColumn]}>
								{shouldShowRank ? b.rank : ""}
							</Txt>
							<View style={[s.playerColumn, s.seasonScoreContainer]}>
								<Txt style={[s.playerTxt]}>
									@{b.name}
									{battleCompleted ? (
										<Txt style={s.seasonScoreTxt}> (+{b.league_points})</Txt>
									) : (
										""
									)}
								</Txt>
							</View>
							<Txt style={[s.placeTxt, s.column]}>${b.earnings}</Txt>
							<Txt style={[s.placeTxt, s.column]}>
								${b.max_payout_remaining}
							</Txt>
						</View>
					);
				})}
			</TouchableOpacity>

			{/* Betslip Section */}
			<TouchableOpacity
				style={s.betslipContainer}
				onPress={() => handleViewUserBetslip()}
			>
				<View style={s.cardSectionHeading}>
					<View style={s.betslipHeadingSection}>
						<Txt style={s.headingTxt}>Betslip</Txt>
					</View>
					<View style={s.seasonScoreContainer}>
						<Txt style={s.betInfoTxt}>
							{getOrdinalSuffix(userRankedBetslip?.rank ?? "—")} Place
						</Txt>
						{battleCompleted ? (
							<Txt style={s.seasonScoreTxt}>(+{userBetslip.league_points})</Txt>
						) : (
							""
						)}
					</View>
				</View>
				<View style={s.betslipValues}>
					<View style={[s.betslipElement]}>
						<Txt style={s.betInfoLabel}>Won:</Txt>
						<Txt style={s.betInfoTxt}>
							{" "}
							{userRankedBetslip?.earnings != null
								? `$${userRankedBetslip.earnings}`
								: "—"}
						</Txt>
					</View>
					<View style={[s.betslipElement]}>
						<Txt style={s.betInfoLabel}>Max:</Txt>
						<Txt style={s.betInfoTxt}>
							{" "}
							{userRankedBetslip?.max_payout_remaining != null
								? `$${userRankedBetslip.max_payout_remaining}`
								: "—"}
						</Txt>
					</View>
					<View style={[s.betslipElement]}>
						<Txt style={s.betInfoLabel}>Hit Rate:</Txt>
						<Txt style={s.betInfoTxt}>
							{" "}
							{userRankedBetslip?.hitRate != null
								? `${userRankedBetslip.hitRate}%`
								: "—"}
						</Txt>
					</View>
				</View>
				<View style={s.keyBetSection}>
					{/* <Txt style={s.betInfoLabel}>Key Bet:</Txt> */}
					{userBetslip.bets.length === 0 && (
						<View style={s.placedBetAlt}>
							<Txt style={s.noBetsTxt}>No bets placed for this battle.</Txt>
						</View>
					)}
					{userBetslip.bets.length !== 0 &&
						(topBet ? (
							<TouchableOpacity onPress={() => handleViewUserBetslip()} style={{paddingTop: 4}}>
								<PlacedBet bet={topBet} backgroundColor={"#1D394E"} />
								<View style={s.keyBetTag}>
									<Txt style={[s.betInfoLabel, {fontSize: 10}]}>Key Bet</Txt>
								</View>
							</TouchableOpacity>
						) : (
							<View style={s.placedBetAlt}>
								<Txt style={s.noBetsTxt}>
									Well... looks like none of your bets hit. Yikes.
								</Txt>
							</View>
						))}
				</View>
			</TouchableOpacity>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		justifyContent: "space-between",
		paddingTop: 4,
		gap: 4,
	},
	headingTxt: {
		letterSpacing: 2,
		fontSize: 10,
		textTransform: "uppercase",
		color: "#B8C3CC",
		paddingBottom: 2,
	},

	// Leaderboard Table Styling
	leaderboardContainer: {
		// flex: 3,
		paddingVertical: 4,
		paddingHorizontal: 8,
		marginHorizontal: -6,
		backgroundColor: "#0F2638",
		borderRadius: 8,
	},
	cardSectionHeading: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	actionButton: {
		flexDirection: "row",
		gap: 4,
		alignItems: "center",
	},
	leaderboardHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 0.5,
		borderColor: "#284357",
	},
	headerRowTxt: {
		fontSize: 12,
		fontFamily: "Saira_600SemiBold",
	},
	column: {
		flex: 1.5,
		textAlign: "center",
	},
	placeColumn: {
		flex: 0.5,
		textAlign: "center",
	},
	playerColumn: {
		flex: 3.5,
	},
	leaderboardRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	placeTxt: {
		fontSize: 12,
	},
	playerTxt: {
		fontSize: 12,
		fontFamily: "Saira_400Regular_Italic",
	},

	// Betslip Styling
	betslipContainer: {
		// flex: 1.1,
		paddingVertical: 4,
		paddingHorizontal: 8,
		marginHorizontal: -6,
		backgroundColor: "#0F2638",
		borderRadius: 8,
	},
	betslipHeadingSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	// Betslip Section
	betslipValues: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},
	betInfoLabel: {
		fontFamily: "Saira_600SemiBold",
		fontSize: 12,
	},
	betInfoTxt: {
		fontSize: 12,
	},
	betslipElement: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	placedBetAlt: {
		paddingHorizontal: 8,
		borderRadius: 8,
		paddingVertical: 12,
		flexDirection: "row",
		backgroundColor: "#1D394E",
		marginTop: 2,
		justifyContent: "center",
		marginBottom: 2,
	},
	noBetsTxt: {
		fontFamily: "Saira_400Regular_Italic",
		fontSize: 14,
	},
	keyBetTag: {
		position: 'absolute', 
		right: -2, 
		top: 4, 
		backgroundColor: '#54D18C', 
		paddingHorizontal: 4, 
		borderRadius: 4,
	},

	// Completed Betslip
	seasonScoreTxt: {
		fontSize: "12",
		color: "#54D18C",
	},
	seasonScoreContainer: {
		flexDirection: "row",
		gap: 4,
		paddingBottom: 2,
	},
});
