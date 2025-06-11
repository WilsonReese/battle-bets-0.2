import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

export function DataToggle({ selected, onSelect }) {
  return (
      <TouchableOpacity style={s.container}>
        <Txt>
          Option 1
        </Txt>
        <Txt>
          Option 2
        </Txt>
      </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,

  },
  toggle: {
    paddingHorizontal: 8,
  },
  txt: {
    letterSpacing: 2,
    fontSize: 12,
    textTransform: "uppercase",
    color: "#B8C3CC",
    paddingTop: 8,
    alignSelf: "center",
  },
  selected: {
    borderBottomWidth: 1,
    borderBottomColor: '#54D18C',
  },
  selectedTxt: {
    color: '#F8F8F8',
    // fontFamily: 'Saira_600SemiBold',
  },
});
