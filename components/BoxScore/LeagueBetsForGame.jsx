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
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function LeagueBetsForGame({
	gameId,
	pools,
	selectedPool,
	onToggleSheet,
}) {
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

	const groupBetsByOption = () => {
		const grouped = {};

		leagueBets.forEach((bet) => {
			const id = bet.bet_option.id;
			if (!grouped[id]) {
				grouped[id] = {
					bet_option: bet.bet_option,
					bets: [],
					userIds: new Set(),
					totalAmount: 0,
				};
			}
			grouped[id].bets.push(bet);
			grouped[id].userIds.add(bet.user_id);
			grouped[id].totalAmount += parseFloat(bet.bet_amount);
		});

		return Object.values(grouped).filter((g) => g.bets.length > 0);
	};

	if (loading) return <ActivityIndicator />;

	const groupedBets = groupBetsByOption();

	if (groupedBets.length === 0)
		return (
			<Txt style={{ textAlign: "center", marginTop: 12 }}>
				No league bets yet.
			</Txt>
		);

	return (
		<>
			<TouchableOpacity style={s.leagueSelector} onPress={onToggleSheet}>
				<Txt>{selectedPool?.name ?? "Select League"}</Txt>
        <FontAwesome6 name="caret-down" size={16} color="#54D18C" />
			</TouchableOpacity>
			<View>
				{groupedBets.map(({ bet_option, leagueBets, userIds, totalAmount }) => {
					const userCount = userIds.size;
					const avgAmount = Math.round(totalAmount / userCount);

					return (
						<View key={bet_option.id} style={s.container}>
							<BetDetails
								name={bet_option.title}
								matchup={`${bet_option.game.away_team.name} at ${bet_option.game.home_team.name}`}
								multiplier={bet_option.payout}
							/>
							<Txt style={s.leagueStats}>
								{userCount} {userCount === 1 ? "user" : "users"} bet on this –
								avg ${avgAmount}
							</Txt>
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
	},
	leagueStats: {
		color: "#ccc",
		fontSize: 14,
		marginTop: 6,
	},
	leagueSelector: {
		marginTop: 8,
		paddingHorizontal: 8,
    paddingVertical: 4,
		// backgroundColor: "#1D394E",
    flexDirection: 'row',
		alignItems: "center", 
    gap: 8,
	},
});
