import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetAmount } from "../general/BetAmount";

export function BetOptions({ spreadHome, spreadAway, ou }) {
  return (
    <View>
      <View style={s.option}>
          <Txt style={s.oddsText}>{spreadHome}</Txt>
          <Txt style={s.payoutText}>x2</Txt>
        <BetAmount />
      </View>
      <View style={s.option}>
          <Txt style={s.oddsText}>{spreadAway}</Txt>
          <Txt style={s.payoutText}>x2</Txt>
        <BetAmount />
      </View>
      <Txt>Over/Under: {ou}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  option: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    marginVertical: 4,
    borderRadius: 8,
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  optionDetails: {
    flex: 1,
  },
  betSelector: {
    flex: 1,
  },
  oddsText: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
  payoutText: {
    fontFamily: "Saira_300Light",
    color: "#061826",
  },
});
