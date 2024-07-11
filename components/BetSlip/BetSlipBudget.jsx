import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { useEffect, useState } from "react";
import { FontAwesome6 } from '@expo/vector-icons';
import { useBetContext } from "../contexts/BetContext";

export function BetSlipBudget({ betSectionTitle, budget, betOptionType }) {
  const checkmark = <View style={{paddingRight: 4}}><FontAwesome6 name="check" size={12} color="#0C9449"/></View>
  const { getTotalBetAmount } = useBetContext(); // Use the context
  const totalBetAmount = getTotalBetAmount(betOptionType)


  const [isBudgetUsed, setIsBudgetUsed] = useState(totalBetAmount === budget);

  useEffect(() => {
    setIsBudgetUsed(totalBetAmount === budget);
  }, [totalBetAmount, budget]);

  return (
    <View style={s.container}>
      <View style={s.titleContainer}>
        {isBudgetUsed ? checkmark : null}
        <Txt style={s.titleText}>{betSectionTitle}</Txt>
      </View>
      <View style={s.budget}>
        <Txt style={s.budgetText}>${totalBetAmount}</Txt>
        <Txt style={s.text}> of </Txt>
        <Txt style={s.budgetText}>${budget}</Txt>
        <Txt style={s.text}> spent</Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    // borderTopWidth: 1,
    // borderTopColor: '#DAE1E5',
    backgroundColor: '#184EAD',
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  budget: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'red'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'orange'
  },
  titleText: {
    // color: "#061826",
    fontFamily: 'Saira_600SemiBold',
    fontSize: 14,
  }, 
  text: {
    // color: "#061826",
    fontSize: 14,
  },
  budgetText: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
});
