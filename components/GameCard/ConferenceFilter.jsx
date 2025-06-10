import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { Txt } from "../general/Txt";

export function ConferenceFilter({ selected, onToggle, onClear, conferences }) {
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // style={s.pillRow}
      >
        <View style={s.pillRow}>
          <TouchableOpacity
            onPress={onClear}
            disabled={selected.length === 0}
            style={[s.clearBtn, selected.length === 0 && s.clearBtnDisabled]}
          >
            <Txt
              style={[s.clearTxt, selected.length === 0 && s.clearTxtDisabled]}
            >
              Clear
            </Txt>
          </TouchableOpacity>
          {conferences.map((conf) => {
            const isSelected = selected.includes(conf);
            return (
              <TouchableOpacity
                key={conf}
                onPress={() => onToggle(conf)}
                style={[s.pill, isSelected ? s.pillSelected : s.pillUnselected]}
              >
                <Txt
                  style={[
                    s.pillText,
                    isSelected ? s.pillTextSelected : s.pillTextUnselected,
                  ]}
                >
                  {conf}
                </Txt>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clear Filters Button */}
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  pillRow: {
    flexDirection: "row",
    // paddingBottom: 8,
    paddingHorizontal: 4,
    gap: 8,
    alignItems: "center",
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: "#54D18C",
    borderColor: "#54D18C",
  },
  pillUnselected: {
    backgroundColor: "#0F2638",
    borderColor: "#C7CDD1",
  },
  pillText: {
    fontSize: 14,
    fontFamily: "Saira_600SemiBold",
  },
  pillTextSelected: {
    color: "#F8F8F8",
  },
  pillTextUnselected: {
    color: "#C7CDD1",
  },

  clearBtn: {
    // backgroundColor: 'green'
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnDisabled: {
    // opacity: 0.3,
  },
  clearTxt: {
    fontSize: 12,
    fontFamily: "Saira_600SemiBold",
    color: "#54D18C",
  },
  clearTxtDisabled: {
    color: "#8E9AA4",
  },
});
