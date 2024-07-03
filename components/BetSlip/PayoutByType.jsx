import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function PayoutByType({ calculatePayoutByType }) {
  return (
    <View style={s.container}>
      <Txt style={s.text}>Payout: </Txt>
      <Txt style={s.amountText}>${calculatePayoutByType("spread")}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    flexDirection: 'row',
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: "#061826",
  },
  amountText: {
    color: "#061826",
    fontFamily: 'Saira_600SemiBold',
  }
});
