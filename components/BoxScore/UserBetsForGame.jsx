import { StyleSheet, View } from "react-native";
import { BetDetails } from "../BetSlip/BetDetails";
import { Txt } from "../general/Txt";
import { BetAmount } from "../BetSlip/BetAmount";
import { PlacedBet } from "../Leaderboard/PlacedBet";

export function UserBetsForGame({ userBets, selectedGame }) {
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

		return grouped.map(({ bet_option, bets }) => {
			// Use the status of the bet_option to determine styling
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

			const leagueCount = new Set(
				bets.map((bet) => bet.betslip.battle.league_season.pool.id)
			).size;

			return (
				<View key={bet_option.id} style={s.container}>
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
							/>
						</View>
						<View style={[s.leagueCountContainer, { flex: 2 }]}>
							<Txt style={s.leagueCountTxt}>{`Placed in ${leagueCount} ${
								leagueCount === 1 ? "league" : "leagues"
							}`}</Txt>
						</View>
					</View>
					<View style={s.leagueInstancesContainer}>
						{bets.map((bet) => (
							<View key={bet.id} style={s.leagueInstances}>
								<Txt style={s.leagueNameTxt}>
									{bet.betslip.battle.league_season.pool.name}
								</Txt>
								<View style={s.amountTxtContainer}>
									{isPending && (
										<BetAmount
											betAmount={Math.round(bet.bet_amount)}
											toWinAmount={Math.round(bet.to_win_amount)}
										/>
									)}
									{!isPending && (
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
		justifyContent: 'center',
		paddingLeft: 8,
		alignItems: 'flex-end',
	},
	leagueCountTxt: {
		fontSize: 13,
		fontFamily: 'Saira_400Regular_Italic'
	},
});
