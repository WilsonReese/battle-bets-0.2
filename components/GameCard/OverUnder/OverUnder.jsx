import { StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetOption } from "../BetOption";
import { BetSelector } from "../BetSelector";
import { useState } from "react";
import { Txt } from "../../general/Txt";

export function OverUnder({ ou, ouPayout, setTotalBet }) {
  const [selection, setSelection] = useState({
    optionOne: false,
    optionTwo: false,
  });
  const [betAmount, setBetAmount] = useState(0);
  const [minBet, maxBet] = [100, 1000];

  const selectBet = (type) => {
    setSelection({ [type]: true });
    setBetAmount(minBet);
    setTotalBet((prevTotalBet) => prevTotalBet + minBet);
  };

  const deselectBet = () => {
    setTotalBet((prevTotalBet) => prevTotalBet - betAmount);
    setSelection({ optionOne: false, optionTwo: false });
    setBetAmount(0);
  };

  const toggleBet = (type) => {
    if (!selection.optionOne && !selection.optionTwo) {
      selectBet(type);
    } else if (selection[type]) {
      deselectBet();
    } else {
      // switch between the two bet options
      setTotalBet((prevTotalBet) => prevTotalBet - betAmount);
      setSelection({ [type]: true });
      setBetAmount(minBet);
      setTotalBet((prevTotalBet) => prevTotalBet + minBet);
    }
  };

  return (
    <View style={s.container}>
      <BetTypeHeading heading={"OVER/UNDER"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={`Over ${ou} Points`}
          payout={ouPayout}
          isSelected={selection.optionOne}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={`Under ${ou} Points`}
          payout={ouPayout}
          isSelected={selection.optionTwo}
          onPress={() => toggleBet("optionTwo")}
        />
      </View>
      <View>
        {selection.optionOne && (
          <BetSelector
            option="optionOne"
            closeSelection={() => toggleBet("optionOne")}
            minBet={minBet}
            maxBet={maxBet}
            payout={ouPayout}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            setTotalBet={setTotalBet}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            option="optionTwo"
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={ouPayout}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            setTotalBet={setTotalBet}
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    // paddingTop: 4,
  },
});
