import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { useState } from "react";
import api from "../../utils/axiosConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function EditMemberModal({
  member,
  poolId,
  onRemove,
  modalVisible,
  setModalVisible,
}) {
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
            <View style={s.modalHeadingContainer}>
              <Txt style={s.modalHeadingText}>Edit Membership</Txt>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome6
                  name="x"
                  size={18}
                  color="#F8F8F8"
                  style={{ paddingRight: 6 }}
                />
              </TouchableOpacity>
            </View>
            <View style={s.modalBodyContainer}>
              <View style={s.userInfoContainer}>
                <View style={s.leftSection}>
                  <Txt style={s.txt}>
                    {member.user.first_name} {member.user.last_name}
                  </Txt>
                  <Txt style={s.detailsTxt}>@{member.user.username}</Txt>
                </View>
                <View style={s.rightSection}>
                  <Txt style={s.txt}>Joined</Txt>
                  <Txt style={s.detailsTxt}>2025</Txt>
                </View>
              </View>
              <TouchableOpacity
                style={[s.actionContainer, s.promoteMemberOption]}
              >
                <Txt style={s.txt}>Promote to Commissioner</Txt>
                <FontAwesome6
                  name="arrow-up"
                  size={18}
                  color="black"
                  style={{ paddingRight: 8 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.actionContainer, s.removeMemberOption]}
              >
                <Txt style={s.txt}>
                  Remove {member.user.first_name} from League
                </Txt>
                <FontAwesome6
                  name="trash-can"
                  size={18}
                  color="black"
                  style={{ paddingRight: 7 }}
                />
              </TouchableOpacity>
            </View>
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
    borderRadius: 19,
    // padding: 20,
    width: "80%",
  },
  modalHeadingContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 8,
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
  modalBodyContainer: {
    // paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userInfoContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  leftSection: {
    flex: 1,
  },
  rightSectionSection: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  actionContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoteMemberOption: {
    backgroundColor: "#54D18C",
  },
  removeMemberOption: {
    backgroundColor: "#E06777",
  },
  detailsTxt: {
    color: "#061826",
    fontSize: 12,
    fontFamily: "Saira_400Regular_Italic",
    marginTop: -4,
  },
  txt: {
    fontSize: 16,
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
