import { useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { Txt } from "../general/Txt";
import { BetDetails } from "../BetSlip/BetDetails";
import api from "../../utils/axiosConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function LeagueBetsForGame({
	gameId,
	pools,
	selectedPool,
	onToggleSheet,
}) {
	// if (!selectedPool) return null;
	const [leagueBets, setLeagueBets] = useState([]);
	const [loading, setLoading] = useState(true);

	// const [pools, setPools] = useState([]);
	// const [selectedPool, setSelectedPool] = useState(null);

	/* fetch bets whenever gameId or selectedPool changes */
	useEffect(() => {
		if (!selectedPool) return; // guard
		setLoading(true);
		api
			.get(`/games/${gameId}/league_bets`, {
				params: { pool_id: selectedPool.id },
			})
			.then((res) => setLeagueBets(res.data))
			.catch((err) => console.error("Failed to load league bets:", err))
			.finally(() => setLoading(false));
	}, [gameId, selectedPool]);

	const groupBetsByOption = (bets) => {
		const grouped = {};

		bets.forEach((bet) => {
			const key = bet.bet_option.id;
			if (!grouped[key]) {
				grouped[key] = {
					bet_option: bet.bet_option,
					bets: [], // ← keep the raw bets
					userIds: new Set(),
					totalAmount: 0,
				};
			}
			grouped[key].bets.push(bet);
			grouped[key].userIds.add(bet.user_id);
			grouped[key].totalAmount += Number(bet.bet_amount);
		});

		return Object.values(grouped);
	};

	if (loading) return <ActivityIndicator />;

	const groupedBets = groupBetsByOption(leagueBets);

	console.log("Grouped Bets", groupedBets);

	if (groupedBets.length === 0)
		return (
			<Txt style={{ textAlign: "center", marginTop: 12 }}>
				No league bets yet.
			</Txt>
		);

	return (
		<>
			<TouchableOpacity style={s.leagueSelector} onPress={onToggleSheet}>
				<Txt style={s.poolNameTxt}>{selectedPool?.name ?? "Select League"}</Txt>
				<FontAwesome6 name="caret-down" size={16} color="#54D18C" />
			</TouchableOpacity>
			<View>
				{groupedBets.map(({ bet_option, bets, totalAmount }) => {
					const betCount = bets.length;
					const avgPerBet = Math.round(totalAmount / betCount);

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
						? "#8E9AA4"
						: "#54D18C";

					const textColor = isPending
						? "#F8F8F8"
						: isFailed
						? "#8E9AA4"
						: "#54D18C";

					const textStyle = isPending
						? "Saira_400Regular"
						: isFailed
						? "Saira_400Regular"
						: "Saira_600SemiBold";

					return (
						<View key={bet_option.id} style={s.container}>
							<View style={s.betDetailsContainer}>
								<BetDetails
									name={bet_option.title}
									matchup={`${bet_option.game.away_team.name} at ${bet_option.game.home_team.name}`}
									multiplier={bet_option.payout}
									betNameColor={betNameColor}
									payoutColor={payoutColor}
									textColor={textColor}
									textStyle={textStyle}
								/>
							</View>
							<View style={s.betStatsContainer}>
								<View style={s.stat}>
									<Txt style={[s.leagueStats, s.statLabel]}>Bets Placed: </Txt>
									<Txt style={s.leagueStats}>{betCount}</Txt>
								</View>
								<View style={s.stat}>
									<Txt style={[s.leagueStats, s.statLabel]}>Avg Bet: </Txt>
									<Txt style={s.leagueStats}>${avgPerBet}</Txt>
								</View>
							</View>
						</View>
					);
				})}
			</View>
		</>
	);
}

const s = StyleSheet.create({
	container: {
		marginVertical: 10,
		backgroundColor: "#0F2638",
		padding: 12,
		borderRadius: 8,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	leagueSelector: {
		marginTop: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
		// backgroundColor: "#1D394E",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	poolNameTxt: {
		fontFamily: "Saira_600SemiBold",
	},
	betDetailsContainer: {
		flex: 3,
	},
	betStatsContainer: {
		justifyContent: "center",
		paddingLeft: 10,
		flex: 2,
		alignItems: "flex-end",
	},
	stat: {
		flexDirection: "row",
    margin: -1.5,
	},
	leagueStats: {
		// textAlign: 'right',
		fontSize: 13,
		// marginTop: 6,
	},
  statLabel: {
    fontFamily: 'Saira_600SemiBold'
  }
});
