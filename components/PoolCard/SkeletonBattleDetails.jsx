// components/PoolCard/SkeletonBattleCard.js
import { View, StyleSheet } from "react-native";

export const SkeletonBattleDetails = () => (
  <View style={s.detailsContainer}>
    <View style={s.block} />
    <View style={s.block} />
  </View>
);

const s = StyleSheet.create({
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 4,
  },
  block: {
    flex: 1,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#1E3A4D",
  },
});