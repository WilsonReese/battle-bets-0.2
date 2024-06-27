import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useEffect, useRef, useState } from "react";
import { Txt } from "../../general/Txt";

export function Spread({
  spreadHome,
  spreadAway,
  spreadPayout,
  totalBet,
  setTotalBet,
}) {
  const [selection, setSelection] = useState({ home: false, away: false });
  const [betAmount, setBetAmount] = useState(0);
  const [minBet, maxBet] = [100, 1000];

  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selection.home || selection.away) {
      Animated.timing(animatedHeight, {
        toValue: 54, // Target height - This can be done 
        duration: 150,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [selection]);


  const selectBet = (type) => {
    setSelection({ [type]: true });
    setBetAmount(minBet);
    setTotalBet((prevTotalBet) => prevTotalBet + minBet);
  };

  const deselectBet = () => {
    setTotalBet((prevTotalBet) => prevTotalBet - betAmount);
    setSelection({ home: false, away: false });
    setBetAmount(0);
  };

  const toggleBet = (type) => {
    if (!selection.home && !selection.away) {
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
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={spreadHome}
          payout={spreadPayout}
          isSelected={selection.home}
          onPress={() => toggleBet("home")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={spreadAway}
          payout={spreadPayout}
          isSelected={selection.away}
          onPress={() => toggleBet("away")}
        />
      </View>
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        {selection.home && (
          <BetSelector
            option="home"
            closeSelection={() => toggleBet("home")}
            minBet={minBet}
            maxBet={maxBet}
            payout={spreadPayout}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            setTotalBet={setTotalBet}
          />
        )}
        {selection.away && (
          <BetSelector
            option="away"
            closeSelection={() => toggleBet("away")}
            minBet={minBet}
            maxBet={maxBet}
            payout={spreadPayout}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            setTotalBet={setTotalBet}
          />
        )}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
  },
});
