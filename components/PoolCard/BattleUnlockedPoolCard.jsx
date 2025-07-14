import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Txt } from "../general/Txt";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { usePoolDetails } from "../contexts/PoolDetailsContext";
import { DEFAULT_BUDGETS } from "../../utils/betting-rules";

export function BattleUnlockedPoolCard({
	pool,
	userEntry,
	selectedSeason,
	currentBattle,
	userBetslip,
}) {
	const { memberships } = usePoolDetails(pool.id);

	const totalBudget =
		DEFAULT_BUDGETS.spreadOU + DEFAULT_BUDGETS.moneyLine + DEFAULT_BUDGETS.prop;
	const spent = userBetslip.amount_bet || 0;
	const remaining = totalBudget - spent;

	// Information to get League Participation Rate
	const totalMembers = memberships.length;
	const filledOutBetslips = currentBattle.filled_out_betslip_count;
	const participationRate =
		totalMembers > 0 ? (filledOutBetslips / totalMembers) * 100 : 0;

	const handleMyBetslip = () => {
		if (!userBetslip) {
			Alert.alert("No betslip found", "Please refresh or try again later.");
			return;
		}

		// // If this battle is locked, send them back to the pool screen instead
		// if (currentBattle.locked) {
		// 	Alert.alert(
		// 		"Betslip Locked",
		// 		"This battle is now locked. Redirecting back to your pool."
		// 	);
		// 	// replace so they can’t navigate “back” into the locked battle
		// 	router.replace(`/pools/${pool.id}`);
		// 	return;
		// }

		router.push({
			pathname: `/pools/${pool.id}/battles/${currentBattle.id}`,
			params: {
				betslipId: userBetslip.id,
				leagueSeasonId: selectedSeason.id,
			},
		});
	};

	console.log("Current Battle: ", currentBattle);

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
						<Txt style={s.txt}>{userEntry?.total_points || "0"}</Txt>
					</View>
				</View>
			</View>

			<View style={s.currentBattleContainer}>
				<Txt style={s.sectonHeadingTxt}>Week {currentBattle.week}</Txt>
				<View style={s.infoContainer}>
					<View style={s.infoUnitContainer}>
						<Txt style={s.infoTitleTxt}>League Participation:</Txt>
						<Txt style={s.txt}>{participationRate.toFixed(0)}%</Txt>
					</View>
					<TouchableOpacity
						style={[s.infoUnitContainer, s.betslipButton]}
						onPress={handleMyBetslip}
					>
						<FontAwesome6 name="pen-to-square" size={14} color="#54D18C" />
						<View style={{flexDirection: 'row'}}>
							<Txt style={s.infoTitleTxt}>Edit Betslip: </Txt>
							<Txt style={s.txt}>${remaining} to bet</Txt>
						</View>
					</TouchableOpacity>
				</View>
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
		// backgroundColor: 'green'
	},

	infoUnitContainer: {
		flexDirection: "row",
		gap: 4,
		alignItems: "center",
		// flex: 1,
		// backgroundColor: 'red'
	},

	infoTitleTxt: {
		// color: "#061826",
		fontFamily: "Saira_600SemiBold",
		fontSize: 14,
	},
	betslipButton: {
		backgroundColor: "#1D394E",
		borderRadius: 6,
		// justifyContent: 'space-between',
		paddingHorizontal: 8,
		gap: 6,
		alignSelf: 'flex-start'
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
});
