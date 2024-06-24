import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { BetAmount } from "../BetAmount";
import { BetTypeHeading } from "../BetTypeHeading";
import { SpreadOption } from "./SpreadOption";

export function Spread({ spreadHome, spreadAway, spreadPayout }) {
  return (
    <View style={s.container}>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <SpreadOption spreadTitle={spreadHome} payout={spreadPayout} />
        <View style={{padding: 4}}></View>
        <SpreadOption spreadTitle={spreadAway} payout={spreadPayout} />
      </View>
      <View style={s.option}>
        <Txt style={s.oddsText}>{spreadHome}</Txt>
        <BetAmount payout={spreadPayout} />
      </View>
      <View style={s.option}>
        <Txt style={s.oddsText}>{spreadAway}</Txt>
        <BetAmount payout={spreadPayout} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingTop: 4,
  },
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
  optionsContainer: {
    flexDirection: "row",
  },
});
