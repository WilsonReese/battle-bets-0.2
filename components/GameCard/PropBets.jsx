import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "./BetTypeHeading";
import { BetSelector } from "./BetSelector";
import { BetOption } from "./BetOption";
import { useBetLogic } from "../../hooks/useBetLogic";
import { BETTING_RULES } from "../../utils/betting-rules";

export function PropBets({ betOptions }) {
  const {
    selection,
    isEnabled,
    animatedHeight,
    toggleBet,
    betType,
    currentBetId,
  } = useBetLogic("prop");
  const { minBet, maxBet } = BETTING_RULES[betType];

  const renderPropOptions = (betOptions) => {
    return betOptions.map((option) => (
      <View>
        <BetOption
          title={option.name}
          payout={option.payout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
          {selection.optionOne && (
            <BetSelector
              option="optionOne"
              closeSelection={() => toggleBet("optionOne")}
              minBet={minBet}
              maxBet={maxBet}
              payout={option.payout}
              betId={currentBetId}
            />
          )}
        </Animated.View>
      </View>
    ));
  };

  return (
    <View>
      <BetTypeHeading heading={"Prop Bets"} />
      {renderPropOptions(betOptions)}
    </View>
  );
}

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
  },
});
