import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../../general/Txt";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function LeagueSettings({
  isCurrentUserCommissioner,
  poolDetails,
  selectedSeason,
}) {
  return (
    <>
      <View style={s.settingTitleContainer}>
        <Txt style={s.titleText}>League Info</Txt>
        {isCurrentUserCommissioner && (
          <TouchableOpacity
            style={s.editLeagueButton}
            onPress={() => {
              router.push({
                pathname: "/pools/create",
                params: {
                  poolId: poolDetails.id,
                },
              });
            }}
          >
            <Txt>Edit</Txt>
            <FontAwesome6 name="gear" size={18} color="#54D18C" />
          </TouchableOpacity>
        )}
      </View>
      <View style={s.settingRow}>
        <Txt style={s.settingHeader}>League Name </Txt>
        <Txt>{poolDetails.name}</Txt>
      </View>
      <View style={s.settingRow}>
        <Txt style={s.settingHeader}>Start Week</Txt>
        <Txt>Week {selectedSeason.start_week}</Txt>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
  },
  settingTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 6,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  settingHeader: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
  editLeagueButton: {
    // backgroundColor: 'green',
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // paddingBottom: 16,
  },
});
