import { ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetSlipBudget } from "./BetSlipBudget";
import { useBetContext } from "../contexts/BetContext";
import { Bet } from "./Bet";
import { PayoutByType } from "./PayoutByType";
import { SmallBtn } from "../general/Buttons/SmallBtn";

export function BetSlipDetails({ budget, totalBet }) {
  const { bets } = useBetContext();

  function renderBets(betType) {
    return bets
      .filter((bet) => bet.betType === betType)
      .map((bet) => <Bet key={bet.id} bet={bet} />);
  }

  function calculatePayoutByType(betType) {
    return bets
      .filter((bet) => bet.betType === betType)
      .reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  function calculateTotalPayout() {
    return bets.reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  return (
    <ScrollView>
      <View style={s.container}>
        <BetSlipBudget
          betType={"Spread and Over/Under"}
          budget={budget}
          totalBet={totalBet}
        />
        {renderBets("spread")}
        {/* <View style={s.payoutByType}>
          <Txt style={[s.betDetailsText, {alignSelf: 'flex-end', borderWidth: 1}]}>Payout: ${calculatePayoutByType('spread')}</Txt>
        </View> */}
        <PayoutByType calculatePayout={calculatePayoutByType} />
        <View style={s.btnContainer}>
          <SmallBtn isEnabled={true} text={"See Betting Options"} />
        </View>
        <BetSlipBudget
          betType={"Money Line"}
          budget={budget}
          totalBet={totalBet}
        />
        <Txt style={s.betDetailsText}>Money Line Here</Txt>
        <Txt style={[s.betDetailsText, { alignSelf: "flex-end" }]}>
          Payout: $$$$
        </Txt>
        <Txt style={[s.betDetailsText, { alignSelf: "center" }]}>
          Add more bets
        </Txt>
        <BetSlipBudget
          betType={"Prop Bets"}
          budget={budget}
          totalBet={totalBet}
        />
        <Txt style={s.betDetailsText}>Prop Bets Here</Txt>
        <Txt style={[s.betDetailsText, { alignSelf: "flex-end" }]}>
          Payout: $$$$
        </Txt>
        <Txt style={[s.betDetailsText, { alignSelf: "center" }]}>
          Add more bets
        </Txt>
      </View>
      <View style={s.payoutContainer}>
        <Txt style={s.payoutHeading}>Total Payout: </Txt>
        <Txt style={s.payoutText}>${calculateTotalPayout()}</Txt>
      </View>

      {/* This creates the space needed for the ScrollView to show everything  */}
      <View style={{ height: 50 }}></View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingHorizontal: 8,
  },
  betDetailsText: {
    color: "#061826",
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
  btnContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  }
});
