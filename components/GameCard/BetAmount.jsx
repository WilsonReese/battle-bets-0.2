import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetAmount({ payout }) {
  return (
    <View style={s.container}>
      <View>
        <Txt style={s.payoutText}>x{payout}</Txt>
      </View>
      <View style={s.selector}>
        <TouchableOpacity style={s.activeSign}>
          <Txt>-</Txt>
        </TouchableOpacity>

        {/* THIS IS WHERE I NEED TO WRITE A FUNCTION AND A USE STATE */}
        <View style={s.amount}>
          <Txt style={s.wagerTxt}>${0}</Txt>
        </View>
        <TouchableOpacity style={s.activeSign}>
          <Txt>+</Txt>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  payoutText: {
    fontFamily: "Saira_300Light",
    color: "#061826",
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 12,
  },
  activeSign: {
    backgroundColor: "#2271FA",
    height: 35,
    width: 35,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  amount: {
    width: 80,
    alignItems: "center",
  },
  wagerTxt: {
    color: "#061826",
  },
});
