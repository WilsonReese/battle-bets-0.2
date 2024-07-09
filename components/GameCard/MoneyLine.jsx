import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "./BetTypeHeading";
import { BetSelector } from "./BetSelector";
import { BetOption } from "./BetOption";
import { useBetLogic } from "../../hooks/useBetLogic";
import { BETTING_RULES } from "../../utils/betting-rules";


export function MoneyLine({ moneyLineHome, moneyLineHomePayout, moneyLineAway, moneyLineAwayPayout }) {
  const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("moneyLine", moneyLineHome, moneyLineAway, moneyLineHomePayout, moneyLineAwayPayout);
  const { minBet, maxBet } = BETTING_RULES[betType];

  return (
    <View>
      <BetTypeHeading heading={"Money Line"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={moneyLineHome}
          payout={moneyLineHomePayout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={moneyLineAway}
          payout={moneyLineAwayPayout}
          isSelected={selection.optionTwo}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionTwo")}
        />
      </View>
      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        {selection.optionOne && (
          <BetSelector
            option="optionOne"
            closeSelection={() => toggleBet("optionOne")}
            minBet={minBet}
            maxBet={maxBet}
            payout={moneyLineHomePayout}
            betId={currentBetId}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            option="optionTwo"
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={moneyLineAwayPayout}
            betId={currentBetId}
          />
        )}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
  },
});