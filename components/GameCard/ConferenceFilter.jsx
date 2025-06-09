import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";

export function ConferenceFilter({ selected, onToggle, conferences }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillRow}>
      {conferences.map((conf) => {
        const isSelected = selected.includes(conf);
        return (
          <TouchableOpacity
            key={conf}
            onPress={() => onToggle(conf)}
            style={[s.pill, isSelected ? s.pillSelected : s.pillUnselected]}
          >
            <Text style={[s.pillText, isSelected ? s.pillTextSelected : s.pillTextUnselected]}>
              {conf}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pillRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: "#5996FF",
    borderColor: "#5996FF",
  },
  pillUnselected: {
    backgroundColor: "#0F2638",
    borderColor: "#ccc",
  },
  pillText: {
    fontSize: 14,
    fontFamily: "Saira_600SemiBold",
  },
  pillTextSelected: {
    color: "#fff",
  },
  pillTextUnselected: {
    color: "#ccc",
  },
});