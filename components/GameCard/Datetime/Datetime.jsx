import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { format } from "date-fns";

export function Datetime({ date}) {
  return (
    <View style={s.datetime}>
      <Txt style={s.text}>
        {format(new Date(date), "MMMM d, h:mm a")}
      </Txt>
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
  },
});
