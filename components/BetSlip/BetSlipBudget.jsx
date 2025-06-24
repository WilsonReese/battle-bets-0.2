import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { useEffect, useState } from "react";
import { FontAwesome6 } from '@expo/vector-icons';
import { useBetOps } from "../contexts/BetContext";

export function BetSlipBudget({ betSectionTitle, budget, betOptionType }) {
  const checkmark = <View style={{paddingRight: 8}}><FontAwesome6 name="check" size={16} color="#54D18C"/></View>
  const { getTotalBetAmount } = useBetOps(); // Use the context
  const totalBetAmount = getTotalBetAmount(betOptionType)

    // const totalBetAmount = getTotalBetAmount(betOptionTypeProp);
  // const budget = getBudget(betOptionType);


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
        <Txt style={s.budgetText}>{`$${budget - totalBetAmount} left`}</Txt>
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
    backgroundColor: '#1D394E',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginVertical: 4,
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
    // fontFamily: 'Saira_600SemiBold',
    // fontSize: 14,
    // color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: 1,
    fontSize: 14,
    textTransform: "uppercase"
  }, 
  text: {
    // color: "#061826",
    fontSize: 14,
  },
  budgetText: {
    // color: "#061826",
    // fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
});
