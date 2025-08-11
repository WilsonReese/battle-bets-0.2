import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { BetTypeSection } from "./BetTypeSection";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { Btn } from "../general/Buttons/Btn";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBetStore } from "../../state/useBetStore";

export function BetSlipDetails({ toggleBetSlip }) {
	// const {
	//   bets,
	//   setBetOptionType,
	//   spreadOUBudget,
	//   moneyLineBudget,
	//   propBetBudget,
	// } = useBets();

	// function calculateTotalPayout() {
	//   return bets.reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
	// }

	// function hasBetsOfType(betTypes) {
	//   return bets.some((bet) => betTypes.includes(bet.betType));
	// }

	const hasSpreadOU = useBetStore((state) =>
		state.hasBetsInCategory(["spread", "ou"])
	);
	const hasMoneyLine = useBetStore((state) =>
		state.hasBetsInCategory(["money_line"])
	);
	const hasProps = useBetStore((state) => state.hasBetsInCategory(["prop"]));

	return (
		<View>
			<ScrollView>
				<View style={s.container}>
					<BetSlipBudget
						betSectionTitle={"Spread and Over/Under"}
						// budget={spreadOUBudget}
						budgetCategory={"spreadOU"}
					/>
					{/* Checks if it has bets of this type and renders either the right component or empty section */}
					{hasSpreadOU ? (
						<BetTypeSection
							betTypes={["spread", "ou"]}
							toggleBetSlip={toggleBetSlip}
						/>
					) : (
						<View style={s.emptySectionContainer}>
							<Txt style={s.text}>No bets selected yet.</Txt>
						</View>
					)}
					<BetSlipBudget
						betSectionTitle={"Money Line"}
						// budget={moneyLineBudget}
						budgetCategory={"moneyLine"}
					/>
					{hasMoneyLine ? (
						<BetTypeSection
							betTypes={["money_line"]}
							toggleBetSlip={toggleBetSlip}
						/>
					) : (
						<View style={s.emptySectionContainer}>
							<Txt style={s.text}>No bets selected yet.</Txt>
						</View>
					)}
					<BetSlipBudget
						betSectionTitle={"Prop Bets"}
						// budget={propBetBudget}
						budgetCategory={"prop"}
					/>
					<View style={{marginBottom: 30,}}>
						{hasProps ? (
							<BetTypeSection
								betTypes={["prop"]}
								toggleBetSlip={toggleBetSlip}
							/>
						) : (
							<View style={s.emptySectionContainer}>
								<Txt style={s.text}>No bets selected yet.</Txt>
							</View>
						)}
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		// paddingHorizontal: 8,
		// paddingVertical: 4,
	},
	payoutContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8,
		paddingVertical: 4,
		// borderTopWidth: 1,
		marginHorizontal: 8,
	},
	payoutHeading: {
		color: "#061826",
		textTransform: "uppercase",
		fontFamily: "Saira_600SemiBold",
		// fontSize: 14
	},
	payoutText: {
		color: "#061826",
		fontFamily: "Saira_600SemiBold",
		fontSize: 18,
	},
	text: {
		// color: "#061826",
		fontFamily: "Saira_400Regular_Italic",
		fontSize: 14,
	},
	btns: {
		height: 30,
		width: 165,
		marginHorizontal: 4,
		alignSelf: "center",
		margin: 8,
	},
	emptySectionContainer: {
		paddingHorizontal: 16,
		paddingBottom: 4,
	},
	submitBtnContainer: {
		paddingHorizontal: 16,
		paddingVertical: 4,
	},
});
