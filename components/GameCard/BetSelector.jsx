import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { IncrementBtn } from "../general/Buttons/IncrementBtn";
import { useBetContext } from "../contexts/BetContext";
import { useState, useEffect } from "react";

export function BetSelector({ betId, closeSelection, minBet, maxBet, payout }) {
  const { bets, updateBet, totalBet, getBetOptionType, getBudget } = useBetContext();
  const bet = bets.find((b) => b.id === betId);

  const budget = getBudget(getBetOptionType(bet.betType))

  const [betAmount, setBetAmount] = useState(bet ? bet.betAmount : minBet);

  // update bet amount
  useEffect(() => {
    if (bet) {
      setBetAmount(bet.betAmount);
    }
  }, [bet]);

  const increment = 100;

  const incrementBet = () => {
    if (betAmount < maxBet && totalBet + increment <= budget) {
      const newBetAmount = betAmount + increment;
      setBetAmount(newBetAmount);
      updateBet(betId, newBetAmount, payout);
    }
  };

  const decrementBet = () => {
    if (betAmount > minBet) {
      const newBetAmount = betAmount - increment;
      setBetAmount(newBetAmount);
      updateBet(betId, newBetAmount, payout);
    }
  };

  const minusSign = <FontAwesome6 name="minus" size={18} color="#F8F8F8" />;
  const plusSign = <FontAwesome6 name="plus" size={18} color="#F8F8F8" />;
  const closeIcon = (
    <FontAwesome6 name="circle-xmark" size={24} color="#6E7880" />
  );

  return (
    <View style={s.container}>
      <Pressable
        style={({ pressed }) => [s.closeIcon, pressed && { opacity: 0.5 }]}
        onPress={closeSelection}
      >
        <Txt style={s.text}>{closeIcon}</Txt>
      </Pressable>
      <View icon={minusSign} style={s.betAdjuster}>
        <IncrementBtn
          icon={minusSign}
          isEnabled={betAmount > minBet}
          onPress={decrementBet}
        />
        <View>
          <Txt style={s.text}>${betAmount}</Txt>
        </View>
        <IncrementBtn
          icon={plusSign}
          isEnabled={betAmount < maxBet && totalBet + increment <= budget}
          onPress={incrementBet}
        />
      </View>
      <View style={s.toWin}>
        <Txt style={[s.text, s.toWinText]}>To Win:</Txt>
        <Txt style={[s.text]}>${betAmount * payout}</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#54D18C",
  },
  text: {
    color: "#061826",
  },
  closeIcon: {
    flex: 1,
  },
  betAdjuster: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    flex: 3,
  },
  toWinText: {
    fontSize: 14,
    marginBottom: -4,
    fontFamily: "Saira_600SemiBold",
  },
  toWin: {
    flex: 1.5,
    alignItems: "flex-end",
  },
});