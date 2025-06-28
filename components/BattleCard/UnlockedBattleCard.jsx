import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { CountdownTimer } from "./CountdownTimer";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DEFAULT_BUDGETS } from "../../utils/betting-rules";
import { TeamLogo } from "../GameCard/Matchup/TeamLogo";

export function UnlockedBattleCard({
	battle,
	handleEditBets,
	battleEndDateTime,
	userBetslip,
}) {
	const totalBudget =
		DEFAULT_BUDGETS.spreadOU + DEFAULT_BUDGETS.moneyLine + DEFAULT_BUDGETS.prop;
	const spent = userBetslip.amount_bet || 0;
	const remaining = totalBudget - spent;

	console.log("UserBetslip:", userBetslip);
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

	return (
		<View style={s.container}>
			<View>
				<Txt style={s.headingTxt}>Bets close</Txt>
				<CountdownTimer targetDate={battleEndDateTime} version="large" />
			</View>
			<View style={s.betslipInfoContainer}>
				<Txt style={s.headingTxt}>Betslip</Txt>
				<View style={s.betslipStats}>
					<View style={s.betslipLeft}>
						<View style={s.betslipElement}>
							<Txt style={s.betInfoLabel}>To Bet:</Txt>
							<Txt style={s.betInfoTxt}>${remaining}</Txt>
						</View>
						<View style={[s.betslipElement, { marginTop: -4 }]}>
							<Txt style={s.betInfoLabel}>Max:</Txt>
							<Txt style={s.betInfoTxt}>${userBetslip.max_payout_remaining}</Txt>
						</View>
						<View style={[s.betslipElement, { marginTop: -4 }]}>
							<Txt style={s.betInfoLabel}>Bets Placed:</Txt>
							<Txt style={s.betInfoTxt}>{userBetslip.bets.length}</Txt>
						</View>
					</View>
					<View style={s.betslipRight}>
						<View>
							<Txt style={s.betInfoLabel}>Top Game:</Txt>
							<>
								{topGame ? (
									<View style={s.topGame}>
										<TeamLogo teamName={topGame.awayTeam} size={32} />
										<Txt style={s.betInfoLabel}>at</Txt>
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
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		justifyContent: "space-between",
		paddingTop: 8,
		gap: 6,
	},
	betslipInfoContainer: {
		alignItems: "flex-start",
		paddingTop: 4,
	},
	betslipStats: {
		flexDirection: "row",
		flex: 1,
	},
	betslipLeft: {
		flex: 1,
	},
	betslipRight: {
		flex: 1,
	},
	headingTxt: {
		letterSpacing: 2,
		fontSize: 10,
		textTransform: "uppercase",
		color: "#B8C3CC",
	},
	betInfoLabel: {
		fontFamily: "Saira_600SemiBold",
		fontSize: 12,
	},
	betInfoTxt: {
		fontSize: 14,
	},
	betslipElement: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	topGame: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
});
