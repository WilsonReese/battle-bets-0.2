import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";

export function SpreadAndOUInstructions({}) {
  return (
    <View>
      <View style={s.betHeader}>
        <Txt>Title</Txt>
        <Txt>Instructions Toggle</Txt>
      </View>
      <View>
        <Txt>Betting definition</Txt>
        <Txt>Betting examples</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
    betHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});
