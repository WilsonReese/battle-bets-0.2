import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { BetTypeSection } from "./BetTypeSection";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { Btn } from "../general/Buttons/Btn";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBets } from "../contexts/BetContext";

export function BetSlipDetails({ toggleBetSlip }) {
  const {
    bets,
    setBetOptionType,
    spreadOUBudget,
    moneyLineBudget,
    propBetBudget,
  } = useBets();


  function calculateTotalPayout() {
    return bets.reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  function hasBetsOfType(betTypes) {
    return bets.some((bet) => betTypes.includes(bet.betType));
  }

  return (
    <View>
      <ScrollView>
        <View style={s.container}>
          <BetSlipBudget
            betSectionTitle={"Spread and Over/Under"}
            budget={spreadOUBudget}
            betOptionType={"spreadOU"}
          />
          {/* Checks if it has bets of this type and renders either the right component or empty section */}
          {hasBetsOfType(["spread", "overUnder"]) ? (
            <BetTypeSection
              betTypes={["spread", "overUnder"]}
              toggleBetSlip={toggleBetSlip}
            />
          ) : (
            <View style={s.emptySectionContainer}>
              <Txt style={s.text}>No bets selected yet.</Txt>
            </View>
          )}
          <BetSlipBudget
            betSectionTitle={"Money Line"}
            budget={moneyLineBudget}
            betOptionType={"moneyLine"}
          />
          {hasBetsOfType(["moneyLine"]) ? (
            <BetTypeSection
              betTypes={["moneyLine"]}
              toggleBetSlip={toggleBetSlip}
            />
          ) : (
            <View style={s.emptySectionContainer}>
              <Txt style={s.text}>No bets selected yet.</Txt>
            </View>
          )}
          <BetSlipBudget
            betSectionTitle={"Prop Bets"}
            budget={propBetBudget}
            betOptionType={"prop"}
          />
          {hasBetsOfType(["prop"]) ? (
            <BetTypeSection betTypes={["prop"]} toggleBetSlip={toggleBetSlip} />
          ) : (
            <View style={s.emptySectionContainer}>
              <Txt style={s.text}>No bets selected yet.</Txt>
            </View>
          )}
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
    // borderColor: "#B8C3CC",
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
