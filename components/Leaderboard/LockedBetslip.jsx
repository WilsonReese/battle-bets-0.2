import { Dimensions, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { getOrdinalSuffix } from "../../utils/formatting";
import { PlacedBet } from "./PlacedBet";

const screenHeight = Dimensions.get("window").height;

export function LockedBetslip({ sheetRef, betslip, maxHeight, onClose }) {
  // const snapPoints = useMemo(() => ["40%"], []);
  console.log("Betslip:", betslip);

  function renderPlacedBetsByCategory(betslip) {
    if (!betslip || !betslip.bets) return null;

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

      return (
        <View key={key}>
          <Txt style={s.categoryTitleTxt}>{title}</Txt>
          <View style={{ paddingVertical: 0 }}>
            {filteredBets.map((bet, index) => (
              <PlacedBet key={bet.id} bet={bet} />
            ))}
          </View>
        </View>
      );
    });
  }

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={[maxHeight]}
      enableDynamicSizing={false}
      // maxDynamicContentSize={maxHeight}
      enablePanDownToClose={true}
      onChange={(index) => {
        if (index === -1) {
          onClose(); // <- triggers clearing the selection
        }
      }}
      backgroundStyle={s.sheetBackground}
      handleIndicatorStyle={s.handle}
    >
      <>
        {betslip ? (
          <>
            <View style={s.headingContainer}>
              <View style={s.titleContainer}>
                <Txt style={s.title}>Betslip</Txt>
                <View style={s.betslipNameContainer}>
                  <Txt style={s.betslipNameTxt}>@{betslip.name}</Txt>
                </View>
              </View>
              <Txt>{getOrdinalSuffix(betslip.rank)} Place</Txt>
            </View>
            <View style={s.betslipStatsContainer}>
              <View style={s.statContainer}>
                <Txt>${betslip.earnings}</Txt>
                <Txt style={s.statCategoryTxt}>Won</Txt>
              </View>
              <View style={s.statContainer}>
                <Txt>${betslip.max_payout_remaining}</Txt>
                <Txt style={s.statCategoryTxt}>Max</Txt>
              </View>
              <View style={s.statContainer}>
                <Txt>
                  {betslip?.hitRate != null ? `${betslip.hitRate}%` : "—"}
                </Txt>
                <Txt style={s.statCategoryTxt}>Hit Rate</Txt>
              </View>
            </View>
            <BottomSheetScrollView>
              {/* This gives a space above the top bet category */}
              <View style={{ paddingVertical: 4 }}>
                {betslip.bets && betslip.bets.length > 0 ? (
                  renderPlacedBetsByCategory(betslip)
                ) : (
                  <Txt
                    style={{
                      textAlign: "center",
                      padding: 16,
                    }}
                  >
                    No bets placed for this battle.
                  </Txt>
                )}
              </View>
            </BottomSheetScrollView>
          </>
        ) : (
          <Txt style={{ textAlign: "center", padding: 16 }}>
            {/* Select a betslip. */}
          </Txt>
        )}
      </>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#1D394E",
  },
  handle: {
    backgroundColor: "#F8F8F8",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    // backgroundColor: "#184EAD",
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
  },
  betslipNameContainer: {
    borderRadius: 8,
    backgroundColor: "#425C70",
    paddingHorizontal: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    // flex: 1,
  },
  title: {
    fontSize: 20,
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    // paddingRight: 8,
  },
  betslipNameTxt: {
    fontSize: 16,
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    // paddingRight: 8,
  },
  betslipStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0F2638",
  },
  statContainer: {
    flex: 1,
    alignItems: "center",
  },
  statCategoryTxt: {
    // color: "#061826",
    // fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 10,
    textTransform: "uppercase",
    color: "#B8C3CC",
    marginTop: -4,
    paddingBottom: 2,
    // paddingTop: 8,
    // alignSelf: "center",
  },

  // Betslip Details Section
  categoryTitleTxt: {
    fontFamily: "Saira_300Light",
    letterSpacing: 1,
    fontSize: 14,
    textTransform: "uppercase",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
