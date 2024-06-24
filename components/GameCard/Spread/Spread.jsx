import { StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { Txt } from "../../general/Txt";
import { BetAmount } from "../BetAmount";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useEffect, useState } from "react";

export function Spread({ spreadHome, spreadAway, spreadPayout }) {
  const [selection, setSelection] = useState(false);

  useEffect(() => {

  })

  return (
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={spreadHome}
          payout={spreadPayout}
          isSelected={selection}
          onPress={setSelection}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={spreadAway}
          payout={spreadPayout}
          isSelected={selection}
          onPress={setSelection}
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
