import { StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { SpreadOption } from "./SpreadOption";
import { Txt } from "../../general/Txt";
import { BetAmount } from "../BetAmount";
import { BetSelector } from "../BetSelector";

export function Spread({ spreadHome, spreadAway, spreadPayout }) {
  {
    /* I need to have a useState for if it is selected or not */
  }

  return (
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <SpreadOption
          spreadTitle={spreadHome}
          payout={spreadPayout}
          isSelected={true}
        />
        <View style={{ padding: 4 }}></View>
        <SpreadOption
          spreadTitle={spreadAway}
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
  },
});
