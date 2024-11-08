import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetSlipModal({ betslip, visible, onClose }) {
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
          <View style={s.headingContainer}>
            <Txt style={s.titleTxt}>{betslip.name}</Txt>
          <View>
            <View style={s.amountsContainer}>
              <Txt style={[s.payoutHeading, s.payoutText, ]}>Won: </Txt>
              <Txt style={s.payoutText}>${betslip.earnings}</Txt>
            </View>
            <View style={s.amountsContainer}>
              <Txt style={[s.payoutHeading, s.payoutText, ]}>Max: </Txt>
              <Txt style={s.payoutText}>${betslip.max_payout_remaining}</Txt>
            </View>
          </View>
          </View>
          <Txt style={s.txt}>Spread Heading</Txt>
          <Txt style={s.txt}>Spread Bets</Txt>
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
    width: "90%",
    height: "60%", // Half of the vertical screen size
    backgroundColor: "white",
    borderRadius: 8,
    // padding: 16,
    // justifyContent: "center",
    // alignItems: "center",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#184EAD",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  titleTxt: {
    fontSize: 20,
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    paddingRight: 8,
  },
  payoutHeading: {
    fontFamily: "Saira_600SemiBold",
  },
  payoutText: {
    color: "#F8F8F8",
    fontSize: 14,
  },
  amountsContainer: {
    flexDirection: "row",
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
});
