import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { BetOptionHeading } from "./BetOptionHeading";
import { PlacedBet } from "./PlacedBet";

export function BetSlipModal({ betslip, visible, onClose }) {
  function renderPlacedBetsByCategory() {
    const categories = [
      {
        key: "spread_and_ou",
        title: "Spread and Over/Under",
        filter: (bet) =>
          bet.bet_option.category === "spread" ||
          bet.bet_option.category === "ou",
      },
      {
        key: "money_line",
        title: "Money Line",
        filter: (bet) => bet.bet_option.category === "money_line",
      },
      {
        key: "prop",
        title: "Prop Bets",
        filter: (bet) => bet.bet_option.category === "prop",
      },
    ];

    return categories.map(({ key, title, filter }) => {
      const filteredBets = betslip.bets.filter(filter);
      if (filteredBets.length === 0) return null;

      const totalAmountWon = filteredBets.reduce(
        (sum, bet) => sum + parseFloat(bet.amount_won || 0),
        0
      );
      const maxPayoutRemaining = filteredBets.reduce(
        (sum, bet) =>
          sum +
          (bet.amount_won !== null
            ? parseFloat(bet.amount_won)
            : parseFloat(bet.to_win_amount)),
        0
      );

      return (
        <View key={key}>
          <BetOptionHeading title={title} />
          <View style={s.betsContainer}>
            {filteredBets.map((bet, index) => (
              <PlacedBet
                key={bet.id}
                bet={bet}
                backgroundColor={index % 2 === 0 ? "#F8F8F8" : "#DAE1E5"}
              />
            ))}
          </View>
          <View>
            <Txt style={s.txt}>Won: ${totalAmountWon}</Txt>
            <Txt style={s.txt}>Max: ${maxPayoutRemaining}</Txt>
          </View>
        </View>
      );
    });
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Pressable overlay for closing the modal */}
      <Pressable style={s.overlay} onPress={onClose}>
        {/* Empty View to capture taps outside the modal content */}
        <View />
      </Pressable>

      {/* Centered modal container */}
      <View style={s.modalContainer}>
        <View style={s.headingContainer}>
          <Txt style={s.titleTxt}>{betslip.name}</Txt>
        </View>
        <View style={s.payoutContainer}>
          <View style={s.amountsContainer}>
            <Txt style={[s.payoutHeading, s.payoutText]}>Amount Won: </Txt>
            <Txt style={s.payoutText}>${betslip.earnings}</Txt>
          </View>
          <View style={s.amountsContainer}>
            <Txt style={[s.payoutHeading, s.payoutText]}>Max Remaining: </Txt>
            <Txt style={s.payoutText}>${betslip.max_payout_remaining}</Txt>
          </View>
        </View>

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={s.scrollContent}>
          {renderPlacedBetsByCategory()}
        </ScrollView>
      </View>

      {/* Add an indicator on how to close */}
      {/* <View><Txt>Tap outside to close</Txt></View> */}
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darken background with 50% opacity
  },
  modalContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 150,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    overflow: "hidden",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#184EAD",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  titleTxt: {
    fontSize: 20,
    fontFamily: "Saira_600SemiBold",
    paddingRight: 8,
  },
  payoutContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  payoutHeading: {
    fontFamily: "Saira_600SemiBold",
    // textTransform: 'uppercase'
  },
  payoutText: {
    color: "#061826",
    fontSize: 14,
  },
  amountsContainer: {
    flexDirection: "row",
  },
  betsContainer: {
    paddingVertical: 4,
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
});