import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { SmallBtn } from "../general/Buttons/SmallBtn";
import { BetSelector } from "../GameCard/BetSelector";

export function Bet({ bet }) {
  return (
    <View style={s.container}>
      <View style={s.betItem}>
        <View style={s.betDetailsContainer}>
          <Txt style={s.betName}>{bet.name}: </Txt>
          <Txt style={s.betText}>
            ${bet.betAmount} to win ${bet.toWinAmount}
          </Txt>
        </View>
        <SmallBtn isEnabled={true} text={"Edit"} />
      </View>
      <BetSelector minBet={100} maxBet={1000} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  betItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  betDetailsContainer: {
    flexDirection: "row",
  },
  betName: {
    fontSize: 14,
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
  betText: {
    fontSize: 14,
    color: "#061826",
  },
});
