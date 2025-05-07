import { Modal, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { useState } from "react";
import api from "../../utils/axiosConfig";

export function EditMemberModal({ member, poolId, onRemove, modalVisible, setModalVisible }) {
  // const [modalVisible, setModalVisible] = useState(false);

  const handleConfirmRemove = async () => {
    try {
      await api.delete(`/pools/${poolId}/pool_memberships/${member.id}`);
      onRemove?.(member.id); // Notify parent to refresh or remove from list
      setModalVisible(false);
    } catch (err) {
      console.error("Error removing member:", err.response || err);
      // Optionally show error feedback
      setModalVisible(false);
    }
  };

  return (
    <>
      {/* Modal */}
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Txt style={s.modalText}>Remove {member.user.username}?</Txt>
            <View style={s.modalBtns}>
              <Btn
                btnText="Cancel"
                onPress={() => setModalVisible(false)}
                isEnabled={true}
                style={s.modalBtn}
              />
              <Btn
                btnText="Confirm"
                onPress={handleConfirmRemove}
                isEnabled={true}
                style={s.modalBtn}
                fontColor="#AB1126"
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#061826",
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
