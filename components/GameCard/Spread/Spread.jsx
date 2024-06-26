import { StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useEffect, useState } from "react";

export function Spread({ spreadHome, spreadAway, spreadPayout, budget, setBudget }) {
  const [selection, setSelection] = useState({ home: false, away: false });
  const [minBet, maxBet] = [100, 1000];

  const closeSelection = () => {
    setSelection({ home: false, away: false });
  };

  const updateBudget = (amount) => {
    setBudget((prevBudget) => Math.max(prevBudget - amount, 0));
  };

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
        {selection.home && (
          <BetSelector
            option="home"
            closeSelection={closeSelection}
            minBet={minBet}
            maxBet={maxBet}
            payout={spreadPayout}
            budget={budget}
            updateBudget={updateBudget}
          />
        )}
        {selection.away && (
          <BetSelector
            option="away"
            closeSelection={closeSelection}
            minBet={minBet}
            maxBet={maxBet}
            payout={spreadPayout}
            budget={budget}
            updateBudget={updateBudget}
          />
        )}
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
