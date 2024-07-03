import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { EditBtn } from "../general/Buttons/EditBtn";

export function Bet({ bet }) {
  return (
    <View style={s.betItem}>
      <View style={s.betDetailsContainer}>
        <Txt style={s.betName}>{bet.name}: </Txt>
        <Txt style={s.betText}>
          ${bet.betAmount} to win ${bet.toWinAmount}
        </Txt>
      </View>
      <EditBtn isEnabled={true} text={"Edit"} />
    </View>
  );
}

const s = StyleSheet.create({
  betItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
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
