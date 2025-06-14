import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

export function BoxScoreOrBetsToggle({ selected, onSelect }) {
  return (
    <View style={s.container}>
      <TouchableOpacity
        style={[s.toggle, selected === "boxScore" && s.selected]}
        onPress={() => selected !== "boxScore" && onSelect("boxScore")}
      >
        <Txt
          style={[
            s.txt,
            selected === "boxScore" && s.selectedTxt,
          ]}
        >
          Box Score
        </Txt>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.toggle, selected === "bets" && s.selected]}
        onPress={() => selected !== "bets" && onSelect("bets")}
      >
        <Txt
          style={[
            s.txt,
            selected === "bets" && s.selectedTxt,
          ]}
        >
          Bets
        </Txt>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggle: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
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
