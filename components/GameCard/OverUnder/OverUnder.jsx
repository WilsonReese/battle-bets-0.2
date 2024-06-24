import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { BetAmount } from "../BetAmount";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetOption } from "../BetOption";
import { BetSelector } from "../BetSelector";
import { useState } from "react";

export function OverUnder({ ou, ouPayout }) {
  const [selection, setSelection] = useState({ optionOne: false, optionTwo: false });

  const closeSelection = () => {
    setSelection({ home: false, away: false });
  };
  
  const toggleSelection = (type) => {
    setSelection((prevSelection) => {
      const newSelection = { optionOne: false, optionTwo: false };
      newSelection[type] = !prevSelection[type];
      return newSelection;
    });
  };

  return (
    <View style={s.container}>
      <BetTypeHeading heading={"OVER/UNDER"} />
      <View style={s.optionsContainer}>
        <BetOption 
          title={
            `Over ${ou} Points`} 
          payout={ouPayout} 
          isSelected={selection.optionOne}
          onPress={() => toggleSelection("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption 
          title={`Under ${ou} Points`} 
          payout={ouPayout} 
          isSelected={selection.optionTwo}
          onPress={() => toggleSelection("optionTwo")}
        />
      </View>
      <View>
      {selection.optionOne && <BetSelector option="optionOne" closeSelection={closeSelection} />}
      {selection.optionTwo && <BetSelector option="optionTwo" closeSelection={closeSelection} />}
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
