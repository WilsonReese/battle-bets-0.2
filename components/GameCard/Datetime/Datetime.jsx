import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";

export function Datetime({ date, time }) {
  return (
    <View style={s.datetime}>
      <Txt style={s.text}>{date}, {time}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  datetime: {
    flexDirection: "row",
  },
  text: {
    fontSize: 12,
    color: "#061826",
    fontFamily: "Saira_300Light",
  }
});
