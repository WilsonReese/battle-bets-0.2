import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useBetLogic } from "../../../hooks/useBetLogic";
import { BETTING_RULES } from "../../../utils/betting-rules";

export function OverUnder({ ou, ouPayout, homeTeam, awayTeam }) {
  const overShortTitle = `Over ${ou} Points`;
  const underShortTitle = `Under ${ou} Points`;
  const overTitle = `${homeTeam} v ${awayTeam}: ${overShortTitle}`
  const underTitle = `${homeTeam} v ${awayTeam}: ${underShortTitle}`
  const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("overUnder", overTitle, underTitle, ouPayout);
  const { minBet, maxBet } = BETTING_RULES[betType];

  return (
    <View>
      <BetTypeHeading heading={"Over/Under"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={overShortTitle}
          payout={ouPayout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={underShortTitle}
          payout={ouPayout}
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
            payout={ouPayout}
            betId={currentBetId}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            option="optionTwo"
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={ouPayout}
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