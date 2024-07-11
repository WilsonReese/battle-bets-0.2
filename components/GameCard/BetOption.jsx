import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetOption({ title, payout, isSelected, onPress, isEnabled }) {
  const shadowStyle = isEnabled || isSelected ? s.shadow : null;

  return (
    <View style={s.optionsContainer}>
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
      <View style={s.betNameContainer}>
        <Txt style={[s.oddsText, isEnabled || isSelected ? null : s.disabledText]}>{title}</Txt>
      </View>
      <View style={[s.payout, isEnabled || isSelected ? null : s.disabledOption]}>
        <Txt style={[s.payoutText, isEnabled || isSelected ? null : s.disabledText]}>x{payout}</Txt>
      </View>
    </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    flex: 1,
  },
  optionView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
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
  betNameContainer: {
    flex: 1,
    padding: 8,
  },
  oddsText: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
    fontSize: 14,
  },
  payout: {
    backgroundColor: "#54D18C",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  payoutText: {
    fontFamily: "Saira_300Light",
    color: "#061826",
    fontSize: 14,
  },
  disabledOption: {
    backgroundColor: "#B8C3CC", 
  },
  disabledText: {
    color: "#6E7880",
  },
});