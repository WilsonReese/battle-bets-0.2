import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function PayoutByType({ calculatePayout }) {
  return (
    <View style={s.container}>
      <Txt style={s.text}>Payout: </Txt>
      <Txt style={s.amountText}>${calculatePayout("spread")}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#B8C3CC'
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
