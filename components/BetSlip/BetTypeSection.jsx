import { StyleSheet, View } from "react-native";
import { useBets } from "../contexts/BetContext";
import { Bet } from "./Bet";
import { PayoutByType } from "./PayoutByType";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { useEffect, useState } from "react";
import { Btn } from "../general/Buttons/Btn";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function BetTypeSection({ betTypes, toggleBetSlip }) {
  const { bets } = useBets();
  const [betAmountBtnAction, setBetAmountBtnAction] = useState("Edit");

  function renderBets(betTypes) {
    return bets
      .filter((bet) => betTypes.includes(bet.betType))
      .sort((a, b) => a.addedAt - b.addedAt)
      .map((bet, index) => (
        <Bet
          key={bet.id}
          bet={bet}
          backgroundColor={index % 2 === 0 ? "#0F2638" : "#0F2638"}
        />
      ));
  }

  return (
    <View style={s.container}>
      {renderBets(betTypes)}
      {/* <View style={s.payoutContainer}>
        <PayoutByType calculatePayout={() => calculatePayoutByType(betTypes)} />
      </View> */}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingVertical: 4,
  },
  btns: {
    height: 24,
    width: 40,
    marginHorizontal: 4,
    // borderWidth: 1,
    // borderColor: "#184EAD",
    backgroundColor: '#54D18C'
  },
  payoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#B8C3CC",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
});
