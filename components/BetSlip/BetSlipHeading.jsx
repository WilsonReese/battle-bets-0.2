import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { FontAwesome6 } from '@expo/vector-icons';

export function BetSlipHeading({ poolName, budget, totalBet, isBetSlipShown }) {

    const upArrow = <FontAwesome6 name="chevron-up" size={24} color="#6E7880" />
    const downArrow = <FontAwesome6 name="chevron-down" size={24} color="#6E7880" />

  return (
    <View style={s.container}>
      <View style={s.betSlipTitle}>
        <View style={s.detailsContainer}>
          <Txt style={s.title}>Bet Slip - Pool {poolName}</Txt>
          <View>{isBetSlipShown ? downArrow : upArrow}</View>
        </View>
      </View>
      <BetSlipBudget
        betType={"Spread and Over/Under"}
        budget={budget}
        totalBet={totalBet}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    height: 85,
  },
  betSlipTitle: {
    paddingHorizontal: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
  },
  grabHandleContainer: {
    alignSelf: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  grabHandle: {
    height: 4,
    width: 80,
    backgroundColor: "#6E7880",
    borderRadius: 10,
  },
});
