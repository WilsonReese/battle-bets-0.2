import { Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetOption({ title, payout, isSelected, onPress }) {
  function checkIfSelected() {
    return isSelected ? s.isSelected : s.isNotSelected;
  }

  return (
    <Pressable style={({ pressed }) => [
        s.optionView, 
        checkIfSelected(),
        pressed && { opacity: 0.5 },
        ]}
        onPress={onPress}>
      <Txt style={s.oddsText}>{title}</Txt>
      <View style={s.payout}>
        <Txt style={s.payoutText}>x{payout}</Txt>
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
    // marginVertical: 4,
    borderRadius: 8,
    paddingLeft: 8,
  },
  isNotSelected: {
    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 4,
  },
  isSelected: {
    backgroundColor: "#54D18C",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    paddingBottom: 4,
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
    padding: 8,
  },
  payoutText: {
    fontFamily: "Saira_300Light",
    color: "#061826",
    fontSize: "14",
  },
});
