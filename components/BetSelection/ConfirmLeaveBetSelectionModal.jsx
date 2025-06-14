import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function ConfirmLeaveBetSelectionModal({
  visible,
  onCancel,
  onConfirm,
}) {
  return (
    <>
      <Modal transparent={true} animationType="fade" visible={visible}>
        <TouchableOpacity
          style={s.modalOverlay}
          activeOpacity={1}
          onPressOut={onCancel}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={s.modalContainer}
            onPress={() => {}} // prevent propagation
          >
            <View style={s.content}>
              <Txt style={s.title}>Unsaved Bets</Txt>
              <Txt style={s.message}>
                If you leave, your changes will be lost.
              </Txt>
              <View style={s.buttonRow}>
                {/* <TouchableOpacity onPress={onCancel} style={[s.btn, s.cancelBtn]}>
                  <Txt>Cancel</Txt>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm} style={[s.btn, s.leaveBtn]}>
                  <Txt>Leave</Txt>
                </TouchableOpacity> */}
                <Btn onPress={onCancel} btnText={'Cancel'} isEnabled={true} style={[s.btn, s.cancelBtn]}/>
                <Btn onPress={onConfirm} btnText={'Leave'} isEnabled={true} style={[s.btn, s.leaveBtn]}/>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#061826",
    borderRadius: 8,
    width: "80%",
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Saira_600SemiBold",
    // color: "#061826",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    fontFamily: "Saira_400Regular",
    // color: "#061826",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 4,
  },
  cancelBtn: {
    backgroundColor: "#8E9AA4",
  },
  leaveBtn: {
    backgroundColor: "#E06777",
  },
});
