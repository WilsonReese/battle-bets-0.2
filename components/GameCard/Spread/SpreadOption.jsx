import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";

export function SpreadOption({ spreadTitle, payout }) {
  return (
    <View style={s.optionView}>
      <Txt style={s.oddsText}>{spreadTitle}</Txt>
      <View style={s.payout}>
        <Txt style={s.payoutText}>x{payout}</Txt>
      </View>
    </View>
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
    marginVertical: 4,
    borderRadius: 8,
    paddingLeft: 8,
    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  oddsText: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
  payout: {
    backgroundColor: "#54D18C",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 8,
    borderColor: "#0C9449",
  },
  payoutText: {
    fontFamily: "Saira_300Light",
    color: "#061826",
    fontSize: "14",
  },
});
