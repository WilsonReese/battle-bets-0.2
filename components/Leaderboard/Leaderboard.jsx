import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Row } from "./Row";

export function Leaderboard({ userBetslip, poolId, battleId }) {
  return (
    <View>
      <View style={s.container}>
        <View style={s.firstHeaderElement}>
          <Txt style={s.headerTxt}>Player</Txt>
        </View>
        <View style={s.headerElement}>
          <Txt style={s.headerTxt}>Won</Txt>
        </View>
        <View style={s.headerElement}>
          <Txt style={s.headerTxt}>Max</Txt>
        </View>
        <View style={s.headerElement} />
      </View>
      <View>
        <Row betslip={userBetslip} poolId={poolId} battleId={battleId} />
      </View>
      <View style={s.hiddenBetslips}>
        <Txt style={s.txt}>Other betslips hidden until games start</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "black",
    // flex: 1,
  },
  firstHeaderElement: {
    flex: 1.75,
    // alignItems: 'center',
  },
  headerElement: {
    flex: 1,
    alignItems: "center",
  },
  headerTxt: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
    fontSize: 16,
    // textAlign: "center",
  },
  txt: {
    fontFamily: "Saira_400Regular_Italic",
    color: "#061826",
    fontSize: 14,
    // textAlign: "center",
  },
  hiddenBetslips: {
    alignItems: 'center'
  },
});
