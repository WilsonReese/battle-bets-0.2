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
						<Txt style={s.txt}>{userEntry?.total_points || "N/A"}</Txt>
					</View>
				</View>
			</View>

			<View style={s.currentBattleContainer}>
				<Txt style={s.sectonHeadingTxt}>Week {currentBattle.week}</Txt>
				<View style={s.infoContainer}>
					<View style={s.infoUnitContainer}>
						<Txt style={s.infoTitleTxt}>League Participation:</Txt>
						<Txt style={s.txt}>{participationRate.toFixed(1)}%</Txt>
					</View>
					<TouchableOpacity
						style={s.infoUnitContainer}
						onPress={handleMyBetslip}
					>
						<Txt style={s.infoTitleTxt}>My Betslip:</Txt>
						<Txt style={s.txt}>${remaining} to bet</Txt>

						<FontAwesome6 name="pen-to-square" size={14} color="#54D18C" />
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
	},

	infoUnitContainer: {
		flexDirection: "row",
		gap: 4,
		alignItems: "center",
	},

	infoTitleTxt: {
		// color: "#061826",
		fontFamily: "Saira_600SemiBold",
		fontSize: 14,
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
