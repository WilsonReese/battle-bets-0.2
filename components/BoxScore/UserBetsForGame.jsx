import React, { useState, useEffect, useCallback } from "react";
import {
	StyleSheet,
	View,
	ActivityIndicator, // ⬅️ loading spinner
} from "react-native";
import api from "@/utils/axiosConfig"; // ← adjust your import path
import { Txt } from "../general/Txt";
import { BetDetails } from "../BetSlip/BetDetails";
import { BetAmount } from "../BetSlip/BetAmount";
import { PlacedBet } from "../Leaderboard/PlacedBet";

export function UserBetsForGame({ selectedGame }) {
	/* ────────────────────────────────────────────────────────────
     LOCAL STATE & FETCH LOGIC
     ──────────────────────────────────────────────────────────── */
	const [bets, setBets] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [poolCount, setPoolCount] = useState(0);

	/** tiny helper so we can re-use it elsewhere if needed */
	const getUserBetsByGame = useCallback(async (gameId) => {
		const { data } = await api.get(`/games/${gameId}/my_bets`);
		return data; // { bets:[…], pool_count:N }
	}, []);

	/* fetch whenever the game id changes */
	useEffect(() => {
		if (!selectedGame?.id) {
			setBets([]);
			return;
		}

		let cancelled = false;
		setLoading(true);
		setError(null);

		getUserBetsByGame(selectedGame.id)
			.then((res) => {
				if (!cancelled) {
					setBets(res.bets);
					setPoolCount(res.pool_count);
				}
			})
			.catch((err) => !cancelled && setError(err))
			.finally(() => !cancelled && setLoading(false));

		return () => {
			cancelled = true;
		};
	}, [selectedGame?.id, getUserBetsByGame]);

	/* ────────────────────────────────────────────────────────────
     DERIVED VALUES
     ──────────────────────────────────────────────────────────── */

	const isSinglePool = poolCount === 1;

	/* identical helper from your original code */
	const groupBetsByBetOption = (betsArr) => {
		const grouped = {};
		betsArr.forEach((bet) => {
			const key = bet.bet_option.id;
			(grouped[key] ||= { bet_option: bet.bet_option, bets: [] }).bets.push(
				bet
			);
		});
		return Object.values(grouped);
	};

	/* ────────────────────────────────────────────────────────────
     RENDER PATHS
     ──────────────────────────────────────────────────────────── */
	if (loading) {
		return (
			<View style={{ paddingVertical: 12 }}>
				<ActivityIndicator size="small" color="#54D18C" />
			</View>
		);
	}

	if (error) {
		return (
			<Txt style={{ textAlign: "center", marginTop: 12 }}>
				Failed to load bets.
			</Txt>
		);
	}

	if (bets.length === 0) {
		return (
			<Txt style={{ textAlign: "center", marginTop: 12 }}>
				No bets on this game.
			</Txt>
		);
	}

	/* ---------------- normal rendering ---------------- */
	const renderGroupedUserBets = () =>
		groupBetsByBetOption(bets).map(({ bet_option, bets: grouped }) => {
			const isPending = bet_option.success === null;
			const isFailed = bet_option.success === false;
			const isSuccess = bet_option.success === true;

			const betNameColor = isPending
				? "#F8F8F8"
				: isFailed
				? "#8E9AA4"
				: "#F8F8F8";

			const payoutColor = isPending
				? "#F8F8F8"
				: isFailed
				? "#E06777"
				: "#54D18C";

			const textColor = isPending
				? "#F8F8F8"
				: isFailed
				? "#E06777"
				: "#54D18C";

			const textStyle = isPending
				? "Saira_400Regular"
				: isFailed
				? "Saira_400Regular"
				: "Saira_600SemiBold";

			const leagueCount = new Set(
				grouped.map((b) => b.betslip.battle.league_season.pool.id)
			).size;

			return (
				<View key={bet_option.id} style={s.container}>
					{/* --- header row --- */}
					<View style={s.betDetailsSection}>
						<View style={{ flex: 3 }}>
							<BetDetails
								name={bet_option.title}
								matchup={`${bet_option.game.away_team.name} at ${bet_option.game.home_team.name}`}
								multiplier={bet_option.payout}
								betNameColor={betNameColor}
								payoutColor={payoutColor}
								textColor={textColor}
								textStyle={textStyle}
								strikeThrough={isFailed}
							/>
						</View>

						<View style={[s.leagueCountContainer, { flex: 2 }]}>
							<Txt style={[s.leagueCountTxt, {color: betNameColor}]}>
								Placed in {leagueCount}{" "}
								{leagueCount === 1 ? "league" : "leagues"}
							</Txt>
						</View>
					</View>

					{/* --- individual lines --- */}
					<View style={s.leagueInstancesContainer}>
						{grouped.map((bet) => (
							<View key={bet.id} style={s.leagueInstances}>
								<Txt style={[s.leagueNameTxt,  {color: betNameColor}]}>
									{bet.betslip.battle.league_season.pool.name}
								</Txt>

								<View style={s.amountTxtContainer}>
									{isPending ? (
										<BetAmount
											bet_amount={Math.round(bet.bet_amount)}
											to_win_amount={Math.round(bet.to_win_amount)}
										/>
									) : (
										<Txt
											style={[
												s.txt,
												{ color: textColor, fontFamily: textStyle },
											]}
										>
											Won ${Math.round(bet.amount_won)}
										</Txt>
									)}
								</View>
							</View>
						))}
					</View>
				</View>
			);
		});

	return isSinglePool
		? bets.map((bet) => (
				<View key={bet.id} style={{ paddingTop: 12 }}>
					<PlacedBet bet={bet} />
				</View>
		  ))
		: renderGroupedUserBets();
}

const s = StyleSheet.create({
	container: {
		marginTop: 12,
		marginBottom: 4,
	},
	betDetailsSection: {
		flexDirection: "row",
		paddingVertical: 4,
		paddingHorizontal: 8,
		backgroundColor: "#0F2638",
		borderRadius: 8,
	},
	leagueInstancesContainer: {
		backgroundColor: "#1D394E",
		paddingBottom: 4,
		paddingTop: 2,
		paddingHorizontal: 8,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		marginHorizontal: 8,
	},
	leagueInstances: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	leagueNameTxt: {
		fontSize: 14,
	},
	amountTxtContainer: {
		flexDirection: "row",
	},
	amountTxt: {
		fontSize: 12,
		fontFamily: "Saira_600SemiBold",
	},
	txt: {
		fontSize: 13,
	},
	leagueCountContainer: {
		justifyContent: "center",
		paddingLeft: 8,
		alignItems: "flex-end",
	},
	leagueCountTxt: {
		fontSize: 13,
		fontFamily: "Saira_400Regular_Italic",
	},
});
