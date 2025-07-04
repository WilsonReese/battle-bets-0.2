import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { CountdownTimer } from "./CountdownTimer";
import { StatusIcon } from "../general/StatusIcon";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import { useBets } from "../contexts/BetContext";
import { useBattleLeaderboard } from "../../hooks/useBattleLeaderboard";
import { getOrdinalSuffix } from "../../utils/formatting";
import { SkeletonBattleCard } from "./SkeletonBattleCard";
import { TeamLogo } from "../GameCard/Matchup/TeamLogo";

export function LockedBattleCard({
	battle,
	handleEditBets,
	battleEndDateTime,
	userBetslip,
	poolId,
	refreshVersion,
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

	const topGame = getTopGameMatchup(userBetslip.bets);
	// console.log("UserBetslip Games:", userBetslip.bets[0].bet_option);

	function getTopGameMatchup(bets) {
		if (!Array.isArray(bets) || bets.length === 0) return null;

		const gameCounts = {}; // key: gameKey, value: { count, gameData }

		bets.forEach((bet) => {
			const game = bet?.bet_option?.game;
			const gameId = game?.id;
			if (!game || !gameId) return;

			if (!gameCounts[gameId]) {
				gameCounts[gameId] = { count: 1, game };
			} else {
				gameCounts[gameId].count += 1;
			}
		});

		// Find game with the highest count
		let topGame = null;
		let maxCount = 0;
		Object.values(gameCounts).forEach(({ count, game }) => {
			if (count > maxCount) {
				topGame = game;
				maxCount = count;
			}
		});

		if (!topGame) return null;

		return {
			awayTeam: topGame.away_team?.name || "Away",
			homeTeam: topGame.home_team?.name || "Home",
			gameId: topGame.id,
		};
	}

	// const totalPointsIncrease = 10;

	if (loading) {
		return <SkeletonBattleCard />;
	}

	return (
		<View style={s.container}>
			{/* Leaderboard section */}
			<View style={s.leaderboardContainer}>
				<Txt style={s.headingTxt}>Leaderboard</Txt>
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
			</View>

			{/* Betslip Section */}
			<View style={s.betslipContainer}>
				<Txt style={s.headingTxt}>Betslip</Txt>
				<View style={s.bottomSection}>
					<View>
						<View style={s.seasonScoreContainer}>
							<Txt style={s.betInfoTxt}>
								{getOrdinalSuffix(userRankedBetslip?.rank ?? "—")} Place
							</Txt>
							{battleCompleted ? (
								<Txt style={s.seasonScoreTxt}>
									(+{userBetslip.league_points})
								</Txt>
							) : (
								""
							)}
						</View>
						<Txt style={s.betInfoTxt}>
							Hit Rate:{" "}
							{userRankedBetslip?.hitRate != null
								? `${userRankedBetslip.hitRate}%`
								: "—"}
						</Txt>
					</View>
					<View>
						<Txt style={s.betInfoTxt}>
							Won:{" "}
							{userRankedBetslip?.earnings != null
								? `$${userRankedBetslip.earnings}`
								: "—"}
						</Txt>
						<Txt style={s.betInfoTxt}>
							Max:{" "}
							{userRankedBetslip?.max_payout_remaining != null
								? `$${userRankedBetslip.max_payout_remaining}`
								: "—"}
						</Txt>
					</View>
					<View style={s.topGameSection}>
						<Txt style={s.betInfoTxt}>Top Game:</Txt>
						<>
							{topGame ? (
								<View style={s.topGame}>
									<TeamLogo teamName={topGame.awayTeam} size={32} />
									<Txt style={s.betInfoTxt}>at</Txt>
									<TeamLogo teamName={topGame.homeTeam} size={32} />
								</View>
							) : (
								<Txt style={s.betInfoTxt}>TBD</Txt>
							)}
						</>
					</View>
				</View>
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		justifyContent: "space-between",
		paddingTop: 8,
		gap: 10,
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
		flex: 3,
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
		flex: 1.1,
	},
	bottomSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},
	topGameSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 4,
	},
	betInfoTxt: {
		// fontFamily: "Saira_600SemiBold",
		fontSize: 12,
	},
	topGame: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},

	// Completed Betslip
	seasonScoreTxt: {
		fontSize: "12",
		color: "#54D18C",
	},
	seasonScoreContainer: {
		flexDirection: "row",
		gap: 4,
	},
});
