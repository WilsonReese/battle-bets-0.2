import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { BetAmount } from "../BetAmount";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetOption } from "../BetOption";
import { BetSelector } from "../BetSelector";
import { useState } from "react";

export function OverUnder({ ou, ouPayout }) {
  const [selection, setSelection] = useState({ optionOne: false, optionTwo: false });
  
  const toggleSelection = (type) => {
    setSelection((prevSelection) => ({
      ...prevSelection,
      [type]: !prevSelection[type],
    }));
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
