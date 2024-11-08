import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetSlipModal({ visible, onClose}) {
  return (
    // <View style={[s.container]}>
    //   <Txt>Test</Txt>
    // </View>
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose} // For Android back button
    >
			{/* Might want to make this a touchable without feedback */}
      <Pressable style={s.overlay} onPress={onClose}>
        <View style={s.modalContainer}>
          <Txt style={s.txt}>Placeholder Content</Txt>
        </View>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  // container: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   paddingVertical: 4,
  // },
	overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darken background with 50% opacity
    justifyContent: "center",
    alignItems: "center",
  },
	modalContainer: {
    width: "80%",
    height: "50%", // Half of the vertical screen size
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
});
