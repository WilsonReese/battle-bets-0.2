import { Modal, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { useState } from "react";
import api from "../../utils/axiosConfig";

export function MembershipRow({ member, isLast, poolId, onRemove }) {
  const [modalVisible, setModalVisible] = useState(false);

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
      <View
        key={member.id}
        style={[s.container, !isLast && s.withBottomBorder]}
      >
        <View style={s.leftSection}>
          <Txt style={s.txt}>
            {member.user.first_name} {member.user.last_name}
          </Txt>
          <Txt style={s.detailsTxt}>@{member.user.username}</Txt>
        </View>

        <View style={s.rightSection}>
          <View>
            <Txt>Joined</Txt>
            <Txt style={s.detailsTxt}>2025</Txt>
          </View>
          <View style={s.removeButtonContainer}>
            <Btn
              btnText={"Remove"}
              style={s.btn}
              isEnabled={true}
              fontSize={12}
              fontColor={"#E06777"}
              onPress={() => setModalVisible(true)}
            />
          </View>
        </View>
      </View>

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
  container: {
    paddingTop: 2,
    paddingBottom: 4,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  withBottomBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#3A454D",
  },
  txt: {
    color: "#F8F8F8",
  },
  usernameContainer: {
    marginTop: -4,
  },
  detailsTxt: {
    color: "#B8C3CC",
    fontSize: 12,
    fontFamily: "Saira_400Regular_Italic",
    marginTop: -4,
  },
  removeButtonContainer: {
    paddingLeft: 12,
  },
  btn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E06777",
    paddingHorizontal: 4,
  },

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
