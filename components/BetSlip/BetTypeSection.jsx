import { StyleSheet, View } from "react-native";
import { useBetContext } from "../contexts/BetContext";
import { Bet } from "./Bet";
import { PayoutByType } from "./PayoutByType";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { useEffect, useState } from "react";

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
          backgroundColor={index % 2 === 0 ? "#F8F8F8" : "#DAE1E5"}
        />
      ));
  }

  function calculatePayoutByType(betTypes) {
    return bets
      .filter((bet) => betTypes.includes(bet.betType))
      .reduce((totalPayout, bet) => totalPayout + bet.toWinAmount, 0);
  }

  useEffect(() => {
    setBetAmountBtnAction(isSelectorVisible ? "Save" : "Edit");
  }, [isSelectorVisible]);

  return (
    <View style={s.container}>
      {renderBets(betTypes)}
      <View style={s.payoutContainer}>
        <SmallBtn
          isEnabled={true}
          text={`${betAmountBtnAction} Bets`}
          style={s.btns}
          onPress={() => setIsSelectorVisible(!isSelectorVisible)}
        />
        <PayoutByType calculatePayout={() => calculatePayoutByType(betTypes)} />
      </View>
      {/* <View style={s.btnContainer}>
        <SmallBtn
          isEnabled={true}
          text={"Show Options"}
          style={s.btns}
          onPress={() => {
            setBetOptionType(getBetOptionType(betTypes[0]));
            toggleBetSlip();
          }}
        />
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
    width: 100,
    marginHorizontal: 4,
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#2271FA",
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
    // borderTopWidth: 1,
    borderColor: "#B8C3CC",
    paddingHorizontal: 8,
    paddingVertical: 12,
    // marginVertical: 4,
  },
});
