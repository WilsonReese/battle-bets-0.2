import { Dimensions, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { getOrdinalSuffix } from "../../utils/formatting";

const screenHeight = Dimensions.get("window").height;

export function LockedBetslip({
  sheetRef,
  betslip,
  maxHeight,
  onClose,
}) {
  const snapPoints = useMemo(() => ["60%"], []);
  console.log('Betslip:', betslip)

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
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
                <Txt>{betslip?.hitRate != null ? `${betslip.hitRate}%` : "—"}</Txt>
                <Txt style={s.statCategoryTxt}>Hit Rate</Txt>
              </View>
            </View>
            <BottomSheetScrollView>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
            </BottomSheetScrollView>
          </>
        ) : (
          <Txt style={{ textAlign: "center", padding: 16 }}>
            Select a betslip.
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
});
