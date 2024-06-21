import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetAmount } from "./BetAmount";
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
      <Spread spreadHome={spreadHome} spreadAway={spreadAway} spreadPayout={spreadPayout}/>
      <OverUnder ou={ou} ouPayout={ouPayout}/>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingTop: 4,
  },
  headingView: {
    // alignSelf: 'center'
  },
  headingTxt: {
    color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: "1%",
    fontSize: 12,
  }, 
  option: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    marginVertical: 4,
    borderRadius: 8,
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  optionDetails: {
    flex: 1,
  },
  betSelector: {
    flex: 1,
  },
  oddsText: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
});