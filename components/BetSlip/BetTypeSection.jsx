import { StyleSheet, View } from "react-native";
import { useBetContext } from "../contexts/BetContext";
import { Bet } from "./Bet";
import { PayoutByType } from "./PayoutByType";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { useEffect, useState } from "react";

export function BetTypeSection({ betType, toggleBetSlip }) {
  const { bets, setBetOptionType, getBetOptionType } = useBetContext();
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [betAmountBtnAction, setBetAmountBtnAction] = useState("Edit");

  function renderBets(betType) {
    return bets
      .filter((bet) => bet.betType === betType)
      .map((bet) => (
        <Bet key={bet.id} bet={bet} isSelectorVisible={isSelectorVisible} />
      ));
  }

  function calculatePayoutByType(betType) {
    return bets
      .filter((bet) => bet.betType === betType)
      .reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  useEffect(() => {
    setBetAmountBtnAction(isSelectorVisible ? "Save" : "Edit");
  }, [isSelectorVisible]);

  return (
    <View style={s.container}>
      {renderBets(betType)}
      <PayoutByType calculatePayout={calculatePayoutByType} />
      <View style={s.btnContainer}>
        <SmallBtn
          isEnabled={true}
          text={`${betAmountBtnAction} Bets`}
          style={s.btns}
          onPress={() => setIsSelectorVisible(!isSelectorVisible)}
        />
        <SmallBtn
          isEnabled={true}
          text={"Show Options"}
          style={s.btns}
          onPress={() => {
            setBetOptionType(getBetOptionType(betType));
            toggleBetSlip();
          }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btns: {
    height: 30,
    width: 165,
    marginHorizontal: 4,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
});