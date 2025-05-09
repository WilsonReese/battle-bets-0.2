import { StyleSheet, TouchableOpacity } from "react-native";
import { Txt } from "../../general/Txt";
import { Btn } from "../../general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { LeaveConfirmModal } from "./LeaveConfirmModal";
import { useRouter } from "expo-router";
import api from "../../../utils/axiosConfig";
import { useToastMessage } from "../../../hooks/useToastMessage";

export function LeaveLeagueButton({
  poolId,
  memberships,
  currentUserId,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const {  showError, showSuccess } = useToastMessage();

  const handleConfirmLeave = async () => {
    const userMembership = memberships.find(
      (m) => String(m.user.id) === String(currentUserId)
    );

    if (!userMembership) {
      console.warn("User membership not found.");
      showError("Error finding membership.");
      return;
    }

    try {
      await api.delete(
        `/pools/${poolId}/pool_memberships/${userMembership.id}`
      );
      router.back({});
      // router.replace("/pools"); // Redirect to pools page
    } catch (error) {
      console.error("Error leaving league:", error.response || error);
      showError("Failed to leave league.");
    } finally {
      showSuccess("Left league successfully.");
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={s.button} onPress={() => setModalVisible(true)}>
        <Txt style={s.leaveTxt}>Leave League</Txt>
        <FontAwesome6
          name="arrow-right-from-bracket"
          size={18}
          color="#E06777"
        />
      </TouchableOpacity>

      <LeaveConfirmModal
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmLeave}
      />
    </>
  );
}

const s = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveTxt: {
    color: "#E06777",
  },
});
