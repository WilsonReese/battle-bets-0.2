import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Row } from "./Row";

export function Leaderboard({}) {
  return (
    <View>
      <View style={s.container}>
        <View style={s.firstHeaderElement}>
          <Txt style={s.txt}>Player</Txt>
        </View>
        <View style={s.headerElement}>
          <Txt style={s.txt}>Won</Txt>
        </View>
        <View style={s.headerElement}>
          <Txt style={s.txt}>Max</Txt>
        </View>
        <View style={s.headerElement} />
      </View>
      <View>
        <Row />
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
    alignItems: 'center',
  },
  txt: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
    fontSize: 16,
    // textAlign: "center",
  },
});
