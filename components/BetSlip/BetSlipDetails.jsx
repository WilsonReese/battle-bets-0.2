import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { useBetContext } from "../contexts/BetContext";
import { BetTypeSection } from "./BetTypeSection";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { Btn } from "../general/Buttons/Btn";
import { FontAwesome6 } from '@expo/vector-icons';

export function BetSlipDetails({}) {
  const { bets } = useBetContext();
  const arrowIcon = <FontAwesome6 name="arrow-right" size={16} color="#F8F8F8" />

  function calculateTotalPayout() {
    return bets.reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  function hasBetsOfType(betType) {
    return bets.some((bet) => bet.betType === betType);
  }

  function emptySection(destination) {
    <View style={s.emptySectionContainer}>
      <Txt style={s.text}>Placeholder</Txt>
      <SmallBtn isEnabled={true} text={"Show Options"} style={s.btns} />
    </View>;
  }

  return (
    <View>
      <ScrollView>
        <View style={s.container}>
          <BetSlipBudget betType={"Spread and Over/Under"} />
          {hasBetsOfType("spread") ? (
            <BetTypeSection betType={"spread"} />
          ) : (
            <View style={s.emptySectionContainer}>
              <Txt style={s.text}>No bets selected yet.</Txt>
              <SmallBtn isEnabled={true} text={"Show Options"} style={s.btns} />
            </View>
          )}
          <BetSlipBudget betType={"Money Line"} />
          {hasBetsOfType("money line") ? (
            <BetTypeSection betType={"money line"} />
          ) : (
            <View style={s.emptySectionContainer}>
              <Txt style={s.text}>No bets selected yet.</Txt>
              <SmallBtn isEnabled={true} text={"Show Options"} style={s.btns} />
            </View>
          )}
          <BetSlipBudget betType={"Prop Bets"} />
          {hasBetsOfType("prop") ? (
            <BetTypeSection betType={"props"} />
          ) : (
            <View style={s.emptySectionContainer}>
              <Txt style={s.text}>No bets selected yet.</Txt>
              <SmallBtn isEnabled={true} text={"Show Options"} style={s.btns} />
            </View>
          )}
        </View>
        <View style={s.payoutContainer}>
          <Txt style={s.payoutHeading}>Total Potential Payout: </Txt>
          <Txt style={s.payoutText}>${calculateTotalPayout()}</Txt>
        </View>

        {/* This creates the space needed for the ScrollView to show everything  */}
        <View style={s.submitBtnContainer}>
          <Btn btnText={"Submit Picks"} style={{height: 56}} icon={arrowIcon}/>
        </View>
        <View style={{ height: 50 }}></View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingHorizontal: 8,
  },
  payoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderColor: "#B8C3CC",
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
    color: "#061826",
    fontFamily: "Saira_400Regular_Italic",
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
  },
  submitBtnContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  }
});
