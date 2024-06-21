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
}) {
  return (
    <View style={s.container}>
      <Spread
        spreadHome={spreadHome}
        spreadAway={spreadAway}
        spreadPayout={spreadPayout}
      />
      <OverUnder ou={ou} ouPayout={ouPayout} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingTop: 4,
  },
});
