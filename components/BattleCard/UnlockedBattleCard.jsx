import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { CountdownTimer } from "./CountdownTimer";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DEFAULT_BUDGETS } from "../../utils/betting-rules";
import { TeamLogo } from "../GameCard/Matchup/TeamLogo";
import { PlacedBet } from "../Leaderboard/PlacedBet";
import { Btn } from "../general/Buttons/Btn";

export function UnlockedBattleCard({
	battle,
	handleEditBets,
	battleEndDateTime,
	userBetslip,
	handleEditOpenBetslip,
}) {
	const totalBudget =
		DEFAULT_BUDGETS.spreadOU + DEFAULT_BUDGETS.moneyLine + DEFAULT_BUDGETS.prop;
	const spent = userBetslip?.amount_bet || 0;
	const remaining = totalBudget - spent;

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

	const topBet = getTopBet(userBetslip?.bets);

	return (
		<View style={s.container}>
			<View style={s.betslipInfoContainer}>
				<View style={s.betslipTitleContainer}>
					<Txt style={s.headingTxt}>Betslip</Txt>
					{/* <FontAwesome6 name="circle-chevron-right" size={12} color="#54D18C" /> */}
				</View>
				{/* This is what I am trying to fix */}
				<View style={s.betslipValues}>
					<View style={[s.betslipElement]}>
						<Txt style={s.betInfoLabel}>To Bet:</Txt>
						<Txt style={s.betInfoTxt}>${remaining}</Txt>
					</View>
					<View style={[s.betslipElement]}>
						<Txt style={s.betInfoLabel}>Max:</Txt>
						<Txt style={s.betInfoTxt}>${userBetslip?.max_payout_remaining}</Txt>
					</View>
					<View style={[s.betslipElement]}>
						<Txt style={s.betInfoLabel}>Bets Placed:</Txt>
						<Txt style={s.betInfoTxt}>{userBetslip?.bets.length}</Txt>
					</View>
				</View>
				<View style={s.keyBetSection}>
					<Txt style={s.betInfoLabel}>Key Bet:</Txt>
					{userBetslip?.bets.length === 0 && (
						<View style={s.placedBetAlt}>
							<Txt style={s.noBetsTxt}>
								No bets currently placed for this battle.
							</Txt>
						</View>
					)}
					{userBetslip?.bets.length !== 0 &&
						(topBet ? (
							<TouchableOpacity onPress={() => handleEditOpenBetslip()}>
								<PlacedBet bet={topBet} backgroundColor={"#1D394E"} />
							</TouchableOpacity>
						) : (
							<View style={s.placedBetAlt}>
								<Txt style={s.noBetsTxt}>
									Well... looks like none of your bets hit. Yikes.
								</Txt>
							</View>
						))}
				</View>
				{/* <View
					style={{
						height: 1,
						width: "50%",
						backgroundColor: "#1D394E",
						alignSelf: "center",
						marginVertical: 8,
					}}
				></View> */}
				<View style={s.countdownContainer}>
					<Txt style={s.betInfoLabel}>Games Start:</Txt>
					<CountdownTimer targetDate={battleEndDateTime} version="small" />
				</View>
				<TouchableOpacity
					style={[s.betActionBtn, battle.locked && s.disabled]}
					onPress={() => handleEditBets()}
					disabled={battle.locked}
				>
					<Txt style={s.btnTxt}>
						{userBetslip?.bets.length > 0 ? "Update Bets" : "Place Bets"}
					</Txt>
					<FontAwesome6 name="circle-chevron-right" size={14} color="#F8F8F8" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		justifyContent: "space-between",
		paddingTop: 4,
		gap: 12,
		// backgroundColor: 'blue'
	},
	betslipInfoContainer: {
		// alignItems: "flex-start",
		paddingVertical: 6,
		paddingHorizontal: 8,
		backgroundColor: "#0F2638",
		borderRadius: 8,
		marginHorizontal: -6,
	},
	betslipValues: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},
	keyBetSection: {
		// paddingTop: 8,
	},
	placedBetAlt: {
		paddingHorizontal: 8,
		borderRadius: 8,
		paddingVertical: 12,
		flexDirection: "row",
		backgroundColor: "#1D394E",
		marginTop: 2,
		justifyContent: "center",
	},
	noBetsTxt: {
		fontFamily: "Saira_400Regular_Italic",
		fontSize: 14,
	},
	betActionBtn: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#54D18C",
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 12,
		marginHorizontal: -8,
		marginBottom: -6,
		marginTop: 6,
	},
	countdownContainer: {
		paddingRight: 12,
		borderRadius: 8,
		flexDirection: "row",
		gap: 24,
		paddingBottom: 8,
		paddingTop: 8,
		alignItems: "center",
		alignSelf: "center",
	},
	btnTxt: {
		fontSize: 15,
		fontFamily: "Saira_600SemiBold",
		color: "#F8F8F8",
	},
	headingTxt: {
		letterSpacing: 2,
		fontSize: 10,
		textTransform: "uppercase",
		color: "#C7CDD1",
	},
	countdownTitle: {
		alignSelf: "center",
		fontSize: 10,
		color: "#F8F8F8",
		paddingTop: 2,
		fontFamily: "Saira_600SemiBold",
	},
	betslipTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		alignSelf: "stretch",
		paddingBottom: 4,
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
	disabled: {
		backgroundColor: "#C7CDD1"
	}
});
