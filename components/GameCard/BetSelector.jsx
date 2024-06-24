import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { IncrementBtn } from "../general/Buttons/IncrementBtn";

export function BetSelector({ }) {
  const minusSign = <FontAwesome6 name="minus" size={18} color="#F8F8F8" />;
  const plusSign = <FontAwesome6 name="plus" size={18} color="#F8F8F8" />
  const closeIcon = <FontAwesome6 name="circle-xmark" size={24} color="#6E7880" />
  return (
    <View style={s.container}>
      <View style={s.closeIcon}>
        <Txt style={s.text}>{closeIcon}</Txt>
      </View>
      {/* Need to make this a pressable to remove a bet */}
      <View icon={minusSign} style={s.betAdjuster}>
        <IncrementBtn icon={minusSign} isEnabled={false}/>
        <View>
          <Txt style={s.text}>$2000</Txt>
        </View>
        <IncrementBtn icon={plusSign} isEnabled={true} />
      </View>
      <View style={s.toWin}>
        <Txt style={s.text}>To Win: $1200</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#54D18C",
  },
  text: {
    color: "#061826",
  },
  closeIcon: {
    flex: 1,
  },
  betAdjuster: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    flex: 6
  },
  toWin: {
    flex: 5,
    alignItems: 'flex-end'
  }
});
