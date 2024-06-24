import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { IncrementBtn } from "../general/Buttons/IncrementBtn";

export function BetSelector({ payout }) {
  const minusSign = <FontAwesome6 name="minus" size={18} color="#F8F8F8" />;
  const plusSign = <FontAwesome6 name="plus" size={18} color="#F8F8F8" />
  return (
    <View style={s.container}>
      <View>
        <Txt style={s.text}>Added</Txt>
      </View>
      <View icon={minusSign} style={s.betAdjuster}>
        <IncrementBtn icon={minusSign} isEnabled={false}/>
        <View>
          <Txt style={s.text}>$100</Txt>
        </View>
        <IncrementBtn icon={plusSign} isEnabled={true} />
      </View>
      <View>
        <Txt style={s.text}>To Win: $200</Txt>
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
    padding: 4,
    borderWidth: 1,
    borderColor: "#54D18C",
  },
  text: {
    color: "#061826",
  },
  betAdjuster: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // paddingLeft: 12,
    // flex: 1
  },
  btnIncrement: {
    borderRadius: 50,
    height: 35,
    width: 35,
    // alignSelf: 'flex-start'
  },
});
