import { StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { SpreadOption } from "./SpreadOption";

export function Spread({ spreadHome, spreadAway, spreadPayout }) {
  return (
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <SpreadOption spreadTitle={spreadHome} payout={spreadPayout} isSelected={true} />
        <View style={{padding: 4}}></View>
        <SpreadOption spreadTitle={spreadAway} payout={spreadPayout} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({

  optionsContainer: {
    flexDirection: "row",
  },
});
