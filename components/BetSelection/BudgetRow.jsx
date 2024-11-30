import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Txt } from "../general/Txt";
import { useBetContext } from "../contexts/BetContext";

export function BudgetRow({ }) {
  return (
    <View>
        <Txt>Progress Indicators</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    // flex: 1,
    // backgroundColor: 'green'
  }
});
