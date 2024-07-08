import { StyleSheet, View } from "react-native";
import { Spread } from "./Spread/Spread";
import { OverUnder } from "./OverUnder/OverUnder";
import { useBetContext } from "../contexts/BetContext";

// I will eventually want to change this so that the enum for bet type
// passes only what we need
export function BetOptions({ game }) {
  const {
    spreadHome,
    spreadAway,
    spreadPayout,
    ou,
    ouPayout,
    moneyLineHome,
    moneyLineHomePayout,
    moneyLineAway,
    moneyLineAwayPayout,
  } = game;

  const { betOptionType } = useBetContext(); // Use the context

  return (
    <View style={s.container}>
      {betOptionType === "spreadOU" && (
        <View>
          <Spread
            spreadHome={spreadHome}
            spreadAway={spreadAway}
            spreadPayout={spreadPayout}
          />
          <OverUnder ou={ou} ouPayout={ouPayout} />
        </View>
      )}
      {betOptionType === "moneyLine" && (
        <View>
          <Txt>Money Line Bets</Txt>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingTop: 4,
  },
});
