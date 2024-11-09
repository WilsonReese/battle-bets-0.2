import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function PlacedBet({ bet, backgroundColor }) {
  // Define outcome variables based on bet status
  const isPending = !bet.amount_won;
  const isFailed = bet.amount_won && !bet.bet_option.success;
  const isSuccess = bet.amount_won && bet.bet_option.success;

  // Define colors based on outcome
  const iconColor = isPending ? "#184EAD" : isFailed ? "#AB1126" : "#0C9449";
  const textColor = isPending ? "#184EAD" : isFailed ? "#AB1126" : "#0C9449";

  return (
    <View style={s.container}>
      <View style={[s.betContainer, { backgroundColor: backgroundColor }]}>
        <View style={s.iconContainer}>
          <FontAwesome6
            name={
              isPending ? "circle" : isFailed ? "circle-xmark" : "circle-check"
            }
            size={16}
            color={iconColor}
          />
        </View>
        <View style={s.betNameContainer}>
          <Txt style={s.txt}>{bet.bet_option.long_title}</Txt>
        </View>
        <View style={s.betAmountContainer}>
          {isPending && <Txt style={s.txt}>To Win ${Math.round(bet.to_win_amount)}</Txt>}
          {!isPending && (
            <Txt style={[s.txt, { color: textColor }]}>
              Won ${Math.round(bet.amount_won)}
            </Txt>
          )}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  betContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flex: 0.5,
    justifyContent: "center",
  },
  betNameContainer: {
    flex: 4,
    paddingHorizontal: 4,
  },
  betAmountContainer: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
});
