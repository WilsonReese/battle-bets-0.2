import { StyleSheet, View } from "react-native";
import { BetDetails } from "../BetSlip/BetDetails";
import { Txt } from "../general/Txt";

export function UserBetsForGame({ userBets, selectedGame }) {
	// Bets Stuff
	const allUserBets = Object.values(userBets).flat();
	const uniquePoolIds = [
		...new Set(
			allUserBets.map((bet) => bet.betslip.battle.league_season.pool.id)
		),
	];
	const isSinglePool = uniquePoolIds.length === 1;
	const gameBets = userBets[selectedGame.id] || [];


	const groupBetsByBetOption = (bets) => {
		const grouped = {};

		bets.forEach((bet) => {
			const key = bet.bet_option.id;
			if (!grouped[key]) {
				grouped[key] = {
					bet_option: bet.bet_option,
					bets: [],
				};
			}
			grouped[key].bets.push(bet);
		});

		return Object.values(grouped);
	};

	
	const renderGroupedUserBets = () => {
		const grouped = groupBetsByBetOption(gameBets);

		return grouped.map(({ bet_option, bets }) => (
			<View key={bet_option.id} style={s.multiPoolBetContainer}>
				<BetDetails
					name={bet_option.title}
					matchup={`${bet_option.game.away_team.name} at ${bet_option.game.home_team.name}`}
					multiplier={bet_option.payout}
					betNameColor={"blue"}
					payoutColor={"orange"}
				/>
				{bets.map((bet) => (
					<View key={bet.id} style={{ marginTop: 4 }}>
						<Txt style={{ color: "#ccc", fontSize: 14 }}>
							{bet.betslip.battle.league_season.pool.name}: Bet $
							{Math.round(bet.bet_amount)} to win $
							{Math.round(bet.to_win_amount)}
						</Txt>
					</View>
				))}
			</View>
		));
	};

	return (
		<>
			{isSinglePool
				? gameBets.map((bet) => <PlacedBet key={bet.id} bet={bet} />)
				: renderGroupedUserBets()}
		</>
	);
}

const s = StyleSheet.create({
	container: {},
});
