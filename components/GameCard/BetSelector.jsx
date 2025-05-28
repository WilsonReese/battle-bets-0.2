import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { IncrementBtn } from "../general/Buttons/IncrementBtn";
import { useBetContext } from "../contexts/BetContext";
import { useState, useEffect } from "react";

export function BetSelector({ betId, closeSelection, minBet, maxBet, payout }) {
  const { bets, updateBet, getBetOptionType, getBudget, getTotalBetAmount } =
    useBetContext();
  const bet = bets.find((b) => b.id === betId);

  const budget = bet ? getBudget(getBetOptionType(bet.betType)) : 0;
  const totalBetAmount = bet
    ? getTotalBetAmount(getBetOptionType(bet.betType))
    : 0;

  const [betAmount, setBetAmount] = useState(bet ? bet.betAmount : minBet);

  // update bet amount
  useEffect(() => {
    if (bet) {
      setBetAmount(bet.betAmount);
    }
  }, [bet]);

  const increment = 100;

  const incrementBet = () => {
    if (betAmount < maxBet && totalBetAmount + increment <= budget) {
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
    <FontAwesome6 name="circle-xmark" size={24} color="#F8F8F8" />
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
          isEnabled={betAmount < maxBet && totalBetAmount + increment <= budget}
          onPress={incrementBet}
        />
      </View>
      <View style={s.toWin}>
        <Txt style={[s.text, s.toWinText]}>To Win:</Txt>
        <Txt style={[s.text]}>${Math.round(betAmount * payout)}</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#425C70",
    marginHorizontal: 8,
    // borderTopRightRadius: 
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    // marginBottom: 4,
    // borderWidth: .5,
    borderColor: "#54D18C",

  },
  text: {
    // color: "#061826",
    fontSize: 14,
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
    fontSize: 12,
    marginBottom: -4,
    fontFamily: "Saira_600SemiBold",
  },
  toWin: {
    flex: 1.5,
    alignItems: "flex-end",
  },
});
