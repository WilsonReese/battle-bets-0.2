import { StyleSheet, View } from "react-native";

export function StatusIcon({ isPositive }) {
  return (
    <View style={[s.statusIcon, isPositive ? s.positive : s.negative]}></View>
  );
}

const s = StyleSheet.create({
  statusIcon: {
    height: 8,
    width: 8,
    borderRadius: 100,
  },
  positive: {
    backgroundColor: "#0C9449",
  },
	negative: {
    backgroundColor: '#AB1126', // Red for negative
  },
});
