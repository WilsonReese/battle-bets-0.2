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
  const { bets, addBet, removeBet, totalBet, budget } = useBetContext(); // Use the context
  const [selection, setSelection] = useState({ home: false, away: false });
  const [isEnabled, setIsEnabled] = useState(totalBet < budget);
  const { minBet, maxBet } = BETTING_RULES.spread;
  const animatedHeight = useRef(new Animated.Value(0)).current;
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

  useEffect(() => {
    setIsEnabled(totalBet < budget);
  }, [totalBet, budget]);

  // this listens for if the bet is removed and changes the selection
  useEffect(() => {
    if (!bets.find(bet => bet.id === currentBetId)) {
      setSelection({ home: false, away: false });
    }
  }, [bets]);

  const getTitle = (type) => {
    return type === "home" ? spreadHome : spreadAway;
  };

  const selectBet = (type) => {
    const title = getTitle(type);
    setSelection({ [type]: true });
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
          isEnabled={isEnabled}
          onPress={() => toggleBet("home")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={spreadAway}
          payout={spreadPayout}
          isSelected={selection.away}
          isEnabled={isEnabled}
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
