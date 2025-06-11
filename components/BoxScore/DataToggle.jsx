import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

export function DataToggle({ optionLeft, optionRight, selected, onSelect }) {
  const isLeftSelected = selected === optionLeft;
  const newSelected = isLeftSelected ? optionRight : optionLeft;

  const handleToggle = () => {
    onSelect(newSelected);
  };

  return (
    <TouchableOpacity style={s.container} onPress={handleToggle}>
      <View style={[s.toggle, isLeftSelected ? s.selected : null]}>
        <Txt style={isLeftSelected ? s.selectedTxt : s.unselectedTxt}>
          {optionLeft}
        </Txt>
      </View>
      <View style={[s.toggle, !isLeftSelected ? s.selected : null]}>
        <Txt style={!isLeftSelected ? s.selectedTxt : s.unselectedTxt}>
          {optionRight}
        </Txt>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "#1D394E",
    borderRadius: 50,
    marginHorizontal: 8,
    // marginVertical: 4,
  },
  toggle: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    flex: 1,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#54D18C",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedTxt: {
    color: "#F8F8F8",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
  unselectedTxt: {
    color: "#B8C3CC",
    fontSize: 14,
  },
});
