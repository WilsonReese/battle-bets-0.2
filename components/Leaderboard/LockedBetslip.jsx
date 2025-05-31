import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export function LockedBetslip({ sheetRef, selectedBetslip, snapPoints }) {
  // if (!selectedBetslip) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={s.sheetBackground}
      handleIndicatorStyle={s.handle}
    >
      <BottomSheetView>
        {selectedBetslip ? (
          <>
            <Txt>@{selectedBetslip.name}'s Betslip</Txt>
            <BottomSheetScrollView>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
              <Txt>Bets placed</Txt>
            </BottomSheetScrollView>
          </>
        ) : (
          <Txt style={{ textAlign: "center", padding: 16 }}>
            Select a betslip to view details.
          </Txt>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#1D394E",
  },
  handle: {
    backgroundColor: '#F8F8F8'
  },
});
