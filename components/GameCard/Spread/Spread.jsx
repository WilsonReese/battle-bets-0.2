import { StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { Txt } from "../../general/Txt";
import { BetAmount } from "../BetAmount";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";

export function Spread({ spreadHome, spreadAway, spreadPayout }) {
  {
    /* I need to have a useState for if it is selected or not */
  }

  return (
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={spreadHome}
          payout={spreadPayout}
          isSelected={true}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={spreadAway}
          payout={spreadPayout}
          isSelected={false}
        />
      </View>
      <View>
        <BetSelector />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    // paddingTop: 4,
  },
});
