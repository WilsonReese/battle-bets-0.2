import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useEffect, useRef, useState } from "react";
import { Txt } from "../../general/Txt";
import { useBetContext } from "../../contexts/BetContext";
import uuid from "react-native-uuid";
import { BETTING_RULES } from "../../../utils/betting-rules";

export function Spread({
  spreadHome,
  spreadAway,
  spreadPayout,
}) {
  const [selection, setSelection] = useState({ home: false, away: false });
  const [betAmount, setBetAmount] = useState(0);
  const { minBet, maxBet } = BETTING_RULES.spread;
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const { addBet, removeBet } = useBetContext(); // Use the context
  const [currentBetId, setCurrentBetId] = useState(null);

  // this animates the selection of each bet
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

  const getTitle = (type) => {
    return type === "home" ? spreadHome : spreadAway;
  };

  const selectBet = (type) => {
    const title = getTitle(type);
    setSelection({ [type]: true });
    setBetAmount(minBet);
    const newBet = addBet({
      title: title,
      betAmount: minBet,
      payout: spreadPayout,
      betType: "spread",
    });
    setCurrentBetId(newBet.id);
  };

  const deselectBet = () => {
    removeBet(currentBetId); // Use the unique bet ID
    setCurrentBetId(null);
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
      removeBet(currentBetId); // Remove the previous bet
      const title = getTitle(type);
      setSelection({ [type]: true });
      setBetAmount(minBet);
      const newBet = addBet({
        title: title,
        betAmount: minBet,
        payout: spreadPayout,
        betType: "spread",
      });
      setCurrentBetId(newBet.id);
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
      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        {selection.home && (
          <BetSelector
            option="home"
            closeSelection={() => toggleBet("home")}
            minBet={minBet}
            maxBet={maxBet}
            payout={spreadPayout}
            betId={currentBetId}
          />
        )}
        {selection.away && (
          <BetSelector
            option="away"
            closeSelection={() => toggleBet("away")}
            minBet={minBet}
            maxBet={maxBet}
            payout={spreadPayout}
            betId={currentBetId}
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
