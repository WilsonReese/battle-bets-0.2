import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetSlipDetails({  }) {

  return (
    <View style={s.container}>
      <Txt style={s.betDetailsText}>Test</Txt>
    </View>
  );
}

const s = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
    },
    betDetailsText: {
        color: '#061826',
    },
});
