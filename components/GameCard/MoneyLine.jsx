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

  const awayMoneyLine = moneyLineOptions[0]; // Assuming the first option is for the away team
  const homeMoneyLine = moneyLineOptions[1]; // Assuming the second option is for the home team
  const awayMoneyLineLongTitle = awayMoneyLine.long_title
  const awayMoneyLineShortTitle = awayMoneyLine.title
  const homeMoneyLineLongTitle = homeMoneyLine.long_title
  const homeMoneyLineShortTitle = homeMoneyLine.title
  
  const payouts = {
    optionOne: awayMoneyLine.payout,
    optionTwo: homeMoneyLine.payout,
  };

  const betOptionIDs ={
    optionOne: awayMoneyLine.id,
    optionTwo: homeMoneyLine.id
  }
  const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("moneyLine", awayMoneyLineLongTitle, homeMoneyLineLongTitle, payouts, betOptionIDs, awayMoneyLineShortTitle, homeMoneyLineShortTitle);
  const { minBet, maxBet } = BETTING_RULES[betType];

  return (
    <View>
      <BetTypeHeading heading={"Money Line"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={awayMoneyLine.title}
          payout={awayMoneyLine.payout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={homeMoneyLine.title}
          payout={homeMoneyLine.payout}
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
            payout={awayMoneyLine.payout}
            betId={currentBetId}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={homeMoneyLine.payout}
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