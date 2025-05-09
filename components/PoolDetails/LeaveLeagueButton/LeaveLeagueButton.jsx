import { StyleSheet, TouchableOpacity } from "react-native";
import { Txt } from "../../general/Txt";
import { Btn } from "../../general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { LeaveConfirmModal } from "./LeaveConfirmModal";

export function LeaveLeagueButton({}) {
  const [modalVisible, setModalVisible] = useState(false);

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
        onConfirm={() => {
          // TODO: Add API call to leave league
          console.log("User confirmed leave");
          setModalVisible(false);
        }}
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
