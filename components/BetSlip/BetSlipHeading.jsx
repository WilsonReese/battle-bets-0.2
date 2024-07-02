import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";

export function BetSlipHeading({ poolName, budget, totalBet }) {
  return (
    <View style={s.container}>
      <View style={s.betSlipTitle}>
        <View style={s.grabHandleContainer}>
          <View style={s.grabHandle}></View>
        </View>
        <View style={s.detailsContainer}>
          <Txt style={s.title}>Bet Slip - Pool {poolName}</Txt>
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
