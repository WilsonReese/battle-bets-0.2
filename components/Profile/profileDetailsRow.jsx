import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";

export function ProfileDetailsRow({ label, value, editable, inputs, error }) {
  return (
    <View style={s.detailsRow}>
      <Txt style={s.labelTxt}>{label}</Txt>
      {editable && inputs ? (
        <View style={s.inputGroup}>{inputs}</View>
      ) : (
        <Txt style={s.txt}>{value}</Txt>
      )}
      {error && <Txt style={s.inlineError}>{error}</Txt>}
    </View>
  );
}

const s = StyleSheet.create({
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    // backgroundColor: 'green'
    // justifyContent: "space-between",
    // paddingVertical: 4,
  },
  txt: {
    color: "#F8F8F8",
    paddingVertical: 4,
    fontFamily: "Saira_600SemiBold",
  },
  labelTxt: {
    fontFamily: "Saira_400Regular_Italic",
    fontSize: 14,
  },
  inlineError: {
    fontFamily: "Saira_400Regular_Italic",
    color: "#E06777",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  inputGroup: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 2,
  }
});
