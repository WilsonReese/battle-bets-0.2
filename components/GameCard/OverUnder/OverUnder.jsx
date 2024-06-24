import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { BetAmount } from "../BetAmount";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetOption } from "../BetOption";
import { BetSelector } from "../BetSelector";

export function OverUnder({ ou, ouPayout }) {
  return (
    <View style={s.container}>
      <BetTypeHeading heading={"OVER/UNDER"} />
      <View style={s.optionsContainer}>
        <BetOption 
          title={
            `Over ${ou} Points`} 
          payout={ouPayout} 
          isSelected={false} 
        />
        <View style={{ padding: 4 }}></View>
        <BetOption 
          title={`Under ${ou} Points`} 
          payout={ouPayout} 
          isSelected={true} 
        />
      </View>
      <View>
        <BetSelector />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    // paddingTop: 4,
  },
});
