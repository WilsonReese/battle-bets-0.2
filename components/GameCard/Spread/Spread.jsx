import { StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useEffect, useState } from "react";

export function Spread({ spreadHome, spreadAway, spreadPayout }) {
  const [selection, setSelection] = useState({ home: false, away: false });

  const toggleSelection = (type) => {
    setSelection((prevSelection) => {
      const newSelection = { home: false, away: false };
      newSelection[type] = !prevSelection[type];
      return newSelection;
    });
  };

  return (
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={spreadHome}
          payout={spreadPayout}
          isSelected={selection.home}
          onPress={() => toggleSelection("home")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={spreadAway}
          payout={spreadPayout}
          isSelected={selection.away}
          onPress={() => toggleSelection("away")}
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
