import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetOption({ title, payout, isSelected, onPress, isEnabled }) {
  const shadowStyle = isEnabled || isSelected ? s.shadow : null;

  return (
    <Pressable
      style={({ pressed }) => [
        s.optionView,
        isSelected ? s.isSelected : s.isNotSelected,
        pressed && isEnabled && { opacity: 0.5 },
        !isEnabled && !isSelected && s.disabledOption, // Apply disabled style if not selected
        shadowStyle, // Conditionally apply shadow style
      ]}
      onPress={isEnabled || isSelected ? onPress : null} // Disable onPress if not enabled and not selected
    >
      <Txt style={[ isEnabled || isSelected ? s.oddsText : s.disabledOddsText]}>{title}</Txt>
      <View style={[isEnabled || isSelected ? s.payout: s.disabledPayout]}>
        <Txt style={[ isEnabled || isSelected ? s.payoutText : s.disabledPayoutText]}>x{payout}</Txt>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
  },
  optionView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingLeft: 8,
  },
  isNotSelected: {
    marginBottom: 4,
  },
  isSelected: {
    backgroundColor: "#54D18C",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    paddingBottom: 4,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledOption: {
    backgroundColor: "#B8C3CC", 
  },
  oddsText: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
    fontSize: 14,
  },
  disabledOddsText: {
    fontFamily: "Saira_600SemiBold",
    color: "#6E7880",
    fontSize: 14,
  },
  payout: {
    backgroundColor: "#54D18C",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 8,
  },
  disabledPayout: {
    backgroundColor: "#B8C3CC",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 8,
  },
  payoutText: {
    fontFamily: "Saira_300Light",
    color: "#061826",
    fontSize: 14,
  },
  disabledPayoutText: {
    fontFamily: "Saira_300Light",
    color: "#6E7880",
    fontSize: 14,
  },
});