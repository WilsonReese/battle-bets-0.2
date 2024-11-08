import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetOptionHeading({ title }) {
  return (
    <View style={s.container}>
      <Txt style={s.titleText}>{title}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#184EAD",
		paddingHorizontal: 8,
		paddingVertical: 4,
  },
	titleText: {
    // color: "#061826",
    fontFamily: 'Saira_600SemiBold',
    fontSize: 14,
  }, 
});
