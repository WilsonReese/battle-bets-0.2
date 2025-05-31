import { Dimensions, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const screenHeight = Dimensions.get("window").height;

export function LockedBetslip({
  sheetRef,
  selectedBetslip,
  maxHeight,
  onClose,
}) {
  // if (!selectedBetslip) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      // snapPoints={snapPoints}
      maxDynamicContentSize={maxHeight}
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
        {selectedBetslip ? (
          <>
            <Txt>@{selectedBetslip.name}'s Betslip</Txt>
            <BottomSheetScrollView>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
              <Txt>Spreads and Over/Unders</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Money Line</Txt>
              <Txt>Bets placed</Txt>
              <Txt>Prop Bets</Txt>
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
  // container: {
  //   padding: 12,
  // }
});
