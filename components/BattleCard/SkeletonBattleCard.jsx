// components/BattleCard/SkeletonBattleCard.jsx
import { View, StyleSheet } from "react-native";

export function SkeletonBattleCard() {
  return (
    <View style={s.card}>
      <View style={s.header} />
      <View style={s.bodyRow} />
      <View style={s.bodyRow} />
      <View style={s.bodyRow} />
      <View style={s.bodyRow} />
      <View style={s.bodyRow} />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#0F2638",
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
  },
  header: {
    height: 20,
    backgroundColor: "#2E3E4F",
    borderRadius: 4,
    marginBottom: 8,
  },
  bodyRow: {
    height: 16,
    backgroundColor: "#2E3E4F",
    borderRadius: 4,
    marginBottom: 6,
  },
});
