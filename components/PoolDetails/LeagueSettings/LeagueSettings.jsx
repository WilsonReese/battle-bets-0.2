import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../../general/Txt";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { useState } from "react";
import { useToastMessage } from "../../../hooks/useToastMessage";
import api from "../../../utils/axiosConfig";

export function LeagueSettings({
  isCurrentUserCommissioner,
  poolDetails,
  selectedSeason,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const { showError, showSuccess } = useToastMessage();

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/pools/${poolDetails.id}`);
      showSuccess("League deleted successfully.");
      setModalVisible(false);
      router.back(); // or wherever you want to take them after delete
    } catch (err) {
      console.error("Failed to delete league:", err?.response?.data || err.message);
      showError("Failed to delete league.");
    }
  };

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
      {isCurrentUserCommissioner && (
        <TouchableOpacity style={s.button} onPress={() => setModalVisible(true)}>
          <Txt style={s.deleteTxt}>Delete League</Txt>
          <FontAwesome6 name="trash-can" size={18} color="#E06777" style={{paddingRight: 4}}/>
        </TouchableOpacity>
      )}
      <DeleteConfirmModal
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
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
  button: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'blue'
  },
  deleteTxt: {
    color: "#E06777",
  },
});
