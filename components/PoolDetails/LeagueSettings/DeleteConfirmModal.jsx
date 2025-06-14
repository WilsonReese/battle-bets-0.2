import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { Txt } from "../../general/Txt";
import { Btn } from "../../general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function DeleteConfirmModal({ modalVisible, onClose, onConfirm }) {
  return (
    <Modal transparent={true} animationType="fade" visible={modalVisible}>
      <View style={s.overlay}>
        <View style={s.modalContainer}>
          <View style={s.modalHeadingContainer}>
            <Txt style={s.modalHeadingText}>Delete League</Txt>
            <TouchableOpacity onPress={onClose}>
              <View style={s.closeModalContainer}>
                <FontAwesome6 name="x" size={18} color="#F8F8F8" />
              </View>
            </TouchableOpacity>
          </View>

          <Txt style={s.body}>Are you sure you want to delete this league? This action is irreversible.</Txt>
          <View style={s.actions}>
            <Btn
              btnText="Yes, delete league"
              onPress={onConfirm}
              isEnabled={true}
              style={s.deleteBtn}
              fontColor="#F8F8F8"
              fontSize={14}
            />
            <Btn
              btnText="Cancel"
              onPress={onClose}
              isEnabled={true}
              style={s.cancelBtn}
              fontColor="#184EAD"
              fontSize={14}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    // padding: 16,
    width: "80%",
    // alignItems: "center",
  },
  modalHeadingContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // paddingVertical: 8,
    backgroundColor: "#184EAD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  modalHeadingText: {
    fontFamily: "Saira_600SemiBold",
    color: "#F8F8F8",
    fontSize: 18,
  },
  closeModalContainer: {
    // backgroundColor: 'green',
    paddingVertical: 12,
    paddingRight: 6,
    paddingLeft: 12,
  },
  body: {
    fontSize: 14,
    color: "#061826",
    paddingTop: 12,
    paddingHorizontal: 8,
    // textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  deleteBtn: {
    backgroundColor: "#E06777",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelBtn: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#184EAD",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
