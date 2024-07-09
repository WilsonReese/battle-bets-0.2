import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { useBetContext } from "../../contexts/BetContext";

export function SpreadAndOUInstructions({}) {
  const { betOptionType } = useBetContext(); // Use the context
  
  return (
    <View>
      <View style={s.betHeader}>
        <Txt>{betOptionType}</Txt>
        <Txt>Instructions Toggle</Txt>
      </View>
      {/* <View>
        <Txt>Betting definition</Txt>
        <Txt>Betting examples</Txt>
      </View> */}
    </View>
  );
}

const s = StyleSheet.create({
    betHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});
