import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetTypeHeading({ heading }) {
  return (
    <View style={s.headingView}>
      <Txt style={s.headingTxt}>{heading}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  headingView: {
    // alignSelf: 'center'
  },
  headingTxt: {
    color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: "1%",
    fontSize: 12,
  },
});
