import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { useState } from "react";
import api from "../../utils/axiosConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { formatMembershipJoinDate } from "../../utils/dateUtils";

export function EditMemberModal({
  member,
  poolId,
  onRemove,
  modalVisible,
  onClose,
  onChange,
  showMessage,
}) {
  const [mode, setMode] = useState("default");

  const handleConfirmRemove = async () => {
    try {
      await api.delete(`/pools/${poolId}/pool_memberships/${member.id}`);
      onRemove?.(member.id); // Notify parent to refresh or remove from list
      onChange?.(); // Refresh list
      showMessage?.("User removed successfully", "#0C9449");
      onClose();
      setMode("default");
    } catch (err) {
      console.error("Error removing member:", err.response || err);
      const msg =
        err?.response?.data?.error || "Something went wrong. Please try again.";
      showMessage?.(msg, "#AB1126"); // Show as error (red background)
      resetAndClose();
    }
  };

  const handleConfirmPromote = async () => {
    try {
      await api.patch(`/pools/${poolId}/pool_memberships/${member.id}`, {
        is_commissioner: true,
      });
      onChange?.(); // Refresh list
      showMessage?.("User promoted to commissioner", "#0C9449");
      onClose();
      setMode("default");
    } catch (err) {
      console.error("Error promoting member:", err.response || err);
      const msg =
        err?.response?.data?.error || "Something went wrong. Please try again.";
      showMessage?.(msg, "#AB1126"); // Show as error (red background)
      onClose();
    }
  };

  const handleConfirmDemote = async () => {
    try {
      await api.patch(`/pools/${poolId}/pool_memberships/${member.id}`, {
        pool_membership: { is_commissioner: false },
      });
      onChange?.(); // Refresh list
      showMessage?.("User demoted successfully", "#0C9449");
      onClose();
      setMode("default");
    } catch (err) {
      console.error("Error demoting member:", err.response || err);
      const msg =
        err?.response?.data?.error || "Something went wrong. Please try again.";
      showMessage?.(msg, "#AB1126"); // Show as error (red background)
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setMode("default");
    onClose();
  };

  return (
    <>
      {/* Modal */}
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <View style={s.modalHeadingContainer}>
              <Txt style={s.modalHeadingText}>Edit Membership</Txt>
              <TouchableOpacity onPress={resetAndClose}>
                <View style={s.closeModalContainer}>
                  <FontAwesome6 name="x" size={18} color="#F8F8F8" />
                </View>
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
                  <Txt style={s.detailsTxt}>
                    {formatMembershipJoinDate(member.created_at)}
                  </Txt>
                </View>
              </View>
            </View>

            {/* Which buttons to display */}
            {mode === "default" && (
              <>
                {/* Member is a commissioner  */}
                {member.is_commissioner ? (
                  <TouchableOpacity
                    style={[s.actionContainer, s.removeMemberOption]}
                    onPress={() => setMode("confirmDemote")}
                  >
                    <Txt style={s.removeTxt}>Demote Commissioner</Txt>
                    <FontAwesome6
                      name="arrow-down"
                      size={18}
                      color="#E06777"
                      style={{ paddingRight: 8 }}
                    />
                  </TouchableOpacity>
                ) : (
                  // Member is not a commissioner
                  <TouchableOpacity
                    style={[s.actionContainer, s.promoteMemberOption]}
                    onPress={() => setMode("confirmPromote")}
                  >
                    <Txt style={s.promoteTxt}>Promote to Commissioner</Txt>
                    <FontAwesome6
                      name="crown"
                      size={18}
                      color="#0C9449"
                      style={{ paddingRight: 8 }}
                    />
                  </TouchableOpacity>
                )}

                {/* Only allow removing if not commissioner */}
                {!member.is_commissioner && (
                  <TouchableOpacity
                    style={[s.actionContainer, s.removeMemberOption]}
                    onPress={() => setMode("confirmRemove")}
                  >
                    <Txt style={s.removeTxt}>
                      Remove {member.user.first_name} from League
                    </Txt>
                    <FontAwesome6
                      name="trash-can"
                      size={18}
                      color="#E06777"
                      style={{ paddingRight: 10 }}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* Confirming promotion to commissioner */}
            {mode === "confirmPromote" && (
              <View style={s.confirmActionContainer}>
                <Txt style={[s.txt, s.confirmationTxt]}>
                  Promote this user to commissioner?
                </Txt>
                <View style={s.actions}>
                  <Btn
                    btnText="Yes, promote user"
                    onPress={handleConfirmPromote}
                    isEnabled={true}
                    style={[s.actionBtn, s.greenBtn]}
                    fontSize={14}
                    // fontColor="#AB1126"
                  />
                  <Btn
                    btnText="Cancel"
                    onPress={() => setMode("default")}
                    isEnabled={true}
                    style={[s.actionBtn, s.cancelBtn]}
                    fontColor="#184EAD"
                    fontSize={14}
                  />
                </View>
              </View>
            )}

            {mode === "confirmDemote" && (
              <View style={s.confirmActionContainer}>
                <Txt style={[s.txt, s.confirmationTxt]}>
                  Demote this user from commissioner?
                </Txt>
                <View style={s.actions}>
                  <Btn
                    btnText="Yes, demote user"
                    onPress={handleConfirmDemote}
                    isEnabled={true}
                    style={[s.actionBtn, s.redBtn]}
                    fontSize={14}
                  />
                  <Btn
                    btnText="Cancel"
                    onPress={() => setMode("default")}
                    isEnabled={true}
                    style={[s.actionBtn, s.cancelBtn]}
                    fontColor="#184EAD"
                    fontSize={14}
                  />
                </View>
              </View>
            )}

            {/* Confirming removing user */}
            {mode === "confirmRemove" && (
              <View style={s.confirmActionContainer}>
                <Txt style={[s.txt, s.confirmationTxt]}>
                  Remove this user from league?
                </Txt>
                <View style={s.actions}>
                  <Btn
                    btnText="Yes, remove user"
                    onPress={handleConfirmRemove}
                    isEnabled={true}
                    style={[s.actionBtn, s.redBtn]}
                    fontSize={14}
                    // fontColor="#AB1126"
                  />
                  <Btn
                    btnText="Cancel"
                    onPress={() => setMode("default")}
                    isEnabled={true}
                    style={[s.actionBtn, s.cancelBtn]}
                    fontColor="#184EAD"
                    fontSize={14}
                  />
                </View>
              </View>
            )}
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
    borderRadius: 9,
    // padding: 20,
    width: "80%",
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
    // marginVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DAE1E5",
  },
  promoteMemberOption: {
    // backgroundColor: "#54D18C",
  },
  removeMemberOption: {
    // backgroundColor: "#E06777",
    marginTop: 4,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
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
  removeTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
    color: "#E06777",
  },
  promoteTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
    color: "#0C9449",
  },
  confirmActionContainer: {
    padding: 8,
    alignItems: "center",
  },
  confirmationTxt: {
    paddingBottom: 8,
    fontFamily: "Saira_600SemiBold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  redBtn: {
    backgroundColor: "#E06777",
  },
  greenBtn: {
    backgroundColor: "#0C9449",
  },
  cancelBtn: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#184EAD",
  },
});
