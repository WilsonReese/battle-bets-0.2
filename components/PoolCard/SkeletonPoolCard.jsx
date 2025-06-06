import { View, StyleSheet } from "react-native";

export function SkeletonPoolCard() {
  return (
    <View style={s.card}>
      {/* Header */}
      <View style={s.headingContainer}>
        <View style={s.headingBlock} />
        <View style={s.chevronBlock} />
      </View>

      {/* Body */}
      <View style={s.sectionBlock} />
      <View style={s.sectionBlock} />
      <View style={s.sectionBlockShort} />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#0F2638",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headingBlock: {
    width: "60%",
    height: 20,
    backgroundColor: "#1E3A4D",
    borderRadius: 4,
  },
  chevronBlock: {
    width: 20,
    height: 20,
    backgroundColor: "#1E3A4D",
    borderRadius: 10,
  },
  sectionBlock: {
    height: 14,
    backgroundColor: "#1E3A4D",
    borderRadius: 4,
    marginBottom: 8,
  },
  sectionBlockShort: {
    width: "50%",
    height: 14,
    backgroundColor: "#1E3A4D",
    borderRadius: 4,
    marginBottom: 8,
  },
});