import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { IncrementBtn } from "../general/Buttons/IncrementBtn";
import { useState } from "react";

export function BetSelector({ option, closeSelection, minBet, maxBet, payout, budget, updateBudget }) {
  const [betAmount, setBetAmount] = useState(minBet);

  const incrementBet = () => {
    if (betAmount < maxBet) {
      setBetAmount(betAmount + 100);
      updateBudget(100);
    }
  };

  const decrementBet = () => {
    if (betAmount > minBet) {
      setBetAmount(betAmount - 100);
      updateBudget(-100);
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
        <IncrementBtn icon={minusSign} isEnabled={betAmount > minBet} onPress={decrementBet} />
        <View>
          {/* The Bet Amount should update based on the incremement BTN */}
          <Txt style={s.text}>${betAmount}</Txt>
        </View>
        <IncrementBtn icon={plusSign} isEnabled={betAmount < maxBet} onPress={incrementBet} />
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
    // fontSize: 14,
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
