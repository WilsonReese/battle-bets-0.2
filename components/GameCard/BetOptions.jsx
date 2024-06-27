import { StyleSheet, View } from "react-native";
import { Spread } from "./Spread/Spread";
import { OverUnder } from "./OverUnder/OverUnder";

// I will eventually want to change this so that the enum for bet type
// passes only what we need
export function BetOptions({
  spreadHome,
  spreadAway,
  ou,
  spreadPayout,
  ouPayout,
  budget,
  setBudget,
  totalBet,
  setTotalBet,
}) {
  return (
    <View style={s.container}>
      <Spread
        spreadHome={spreadHome}
        spreadAway={spreadAway}
        spreadPayout={spreadPayout}
        budget={budget}
        setBudget={setBudget}
        totalBet={totalBet}
        setTotalBet={setTotalBet}
      />
      <OverUnder
        ou={ou}
        ouPayout={ouPayout}
        totalBet={totalBet}
        setTotalBet={setTotalBet}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingTop: 4,
  },
});
