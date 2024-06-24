import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Btn";

export function BetSelector({ payout }) {
  return (
    <View style={s.container}>
      <View>
        <Txt style={s.text}>Added</Txt>
      </View>
      <View>
        <Txt>Select amount</Txt>
      </View>
      <View>
        <Txt>To Win:</Txt>
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
});
