import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function PayoutByType({ calculatePayout, betType}) {
  return (
    <View style={s.container}>
      <Txt style={s.text}>Potential Payout: </Txt>
      <Txt style={s.amountText}>${calculatePayout(betType)}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    flexDirection: 'row',
    flex: 1,
    justifyContent: "space-between",
    alignItems: 'center',
    // paddingHorizontal: 8,
    // paddingVertical: 4,
    marginHorizontal: 8,
    // borderTopWidth: 1,
    borderColor: '#B8C3CC',
    // backgroundColor: 'green'
  },
  text: {
    color: "#061826",
    textTransform: 'uppercase',
    fontSize: 14,
  },
  amountText: {
    color: "#061826",
    fontFamily: 'Saira_600SemiBold',
  }
});
