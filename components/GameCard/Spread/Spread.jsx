import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useEffect, useRef, useState } from "react";
import { Txt } from "../../general/Txt";
import { useBetContext } from "../../contexts/BetContext";
import uuid from 'react-native-uuid';

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
  const { addBet, removeBet } = useBetContext(); // Use the context
  const [currentBetId, setCurrentBetId] = useState(null);

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
    // const betId = uuid.v4(); // Generate a unique ID for the new bet
    // setCurrentBetId(betId);
    setSelection({ [type]: true });
    setBetAmount(minBet);
    setTotalBet((prevTotalBet) => prevTotalBet + minBet);
    const newBet = addBet({ title: title, betAmount: minBet, payout: spreadPayout });
    setCurrentBetId(newBet.id)
  };

  const deselectBet = () => {
    removeBet(currentBetId); // Use the unique bet ID
    setCurrentBetId(null);
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
      removeBet(currentBetId); // Remove the previous bet
      setTotalBet((prevTotalBet) => prevTotalBet - betAmount);
      // const newBetId = uuid.v4(); // Generate a new unique ID for the new bet
      // setCurrentBetId(newBetId);
      const title = getTitle(type);
      setSelection({ [type]: true });
      setBetAmount(minBet);
      setTotalBet((prevTotalBet) => prevTotalBet + minBet);
      const newBet = addBet({ title: title, betAmount: minBet, payout: spreadPayout });
      setCurrentBetId(newBet.id)
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
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            setTotalBet={setTotalBet}
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
