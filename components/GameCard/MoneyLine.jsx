import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "./BetTypeHeading";
import { BetSelector } from "./BetSelector";
import { BetOption } from "./BetOption";
import { useBetLogic } from "../../hooks/useBetLogic";
import { BETTING_RULES } from "../../utils/betting-rules";

export function MoneyLine({ moneyLineOptions, homeTeam, awayTeam, moneyLineHome, moneyLineHomePayout, moneyLineAway, moneyLineAwayPayout }) {
  if (!moneyLineOptions || moneyLineOptions.length < 2) {
    return null; // Ensure there are at least two options (home and away)
  }

  const homeMoneyLine = moneyLineOptions[0]; // Assuming the first option is for the home team -- this will be changed in the future
  const awayMoneyLine = moneyLineOptions[1]; // Assuming the second option is for the away team
  const homeMoneyLineLongTitle = `${homeTeam} v ${awayTeam}: ${homeMoneyLine.title}`;
  const awayMoneyLineLongTitle = `${homeTeam} v ${awayTeam}: ${awayMoneyLine.title}`;
  
  const payouts = {
    optionOne: homeMoneyLine.payout,
    optionTwo: awayMoneyLine.payout,
  };
  const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("moneyLine", homeMoneyLineLongTitle, awayMoneyLineLongTitle, payouts);
  const { minBet, maxBet } = BETTING_RULES[betType];

  return (
    <View>
      <BetTypeHeading heading={"Money Line"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={homeMoneyLine.title}
          payout={homeMoneyLine.payout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={awayMoneyLine.title}
          payout={awayMoneyLine.payout}
          isSelected={selection.optionTwo}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionTwo")}
        />
      </View>
      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        {selection.optionOne && (
          <BetSelector
            closeSelection={() => toggleBet("optionOne")}
            minBet={minBet}
            maxBet={maxBet}
            payout={homeMoneyLine.payout}
            betId={currentBetId}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={awayMoneyLine.payout}
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