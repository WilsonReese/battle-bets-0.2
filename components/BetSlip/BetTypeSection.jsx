import { StyleSheet, View } from "react-native";
import { useBetContext } from "../contexts/BetContext";
import { Bet } from "./Bet";
import { PayoutByType } from "./PayoutByType";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { useEffect, useState } from "react";
import { Btn } from "../general/Buttons/Btn";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function BetTypeSection({ betTypes, toggleBetSlip }) {
  const { bets, setBetOptionType, getBetOptionType } = useBetContext();
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [betAmountBtnAction, setBetAmountBtnAction] = useState("Edit");

  function renderBets(betTypes) {
    return bets
      .filter((bet) => betTypes.includes(bet.betType))
      .map((bet, index) => (
        <Bet
          key={bet.id}
          bet={bet}
          isSelectorVisible={isSelectorVisible}
          backgroundColor={index % 2 === 0 ? "#0F2638" : "#1D394E"}
        />
      ));
  }

  function calculatePayoutByType(betTypes) {
    return bets
      .filter((bet) => betTypes.includes(bet.betType))
      .reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  useEffect(() => {
    setBetAmountBtnAction(isSelectorVisible ? <FontAwesome6 name="minus" size={14} color="#F8F8F8" /> : <FontAwesome6 name="plus" size={14} color="#F8F8F8" />);
  }, [isSelectorVisible]);

  return (
    <View style={s.container}>
      {renderBets(betTypes)}
      <View style={s.payoutContainer}>
        <Btn
          isEnabled={true}
          btnText={betAmountBtnAction}
          fontSize={12}
          style={s.btns}
          onPress={() => setIsSelectorVisible(!isSelectorVisible)}
        />
        <PayoutByType calculatePayout={() => calculatePayoutByType(betTypes)} />
      </View>
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
  // btnContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   paddingVertical: 4,
  // },
  payoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#B8C3CC",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
});
