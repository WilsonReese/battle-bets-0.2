import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useBetLogic } from "../../../hooks/useBetLogic";
import { BETTING_RULES } from "../../../utils/betting-rules";

export function OverUnder({ ouOptions, ou, ouPayout, homeTeam, awayTeam, game }) {
  if (!ouOptions || ouOptions.length < 2) {
    return null; // Ensure there are at least two options (home and away)
  }
  
  const over = ouOptions[0];
  const under = ouOptions[1];
  
  const overLongTitle = over.long_title
  const overShortTitle = over.title
  const underLongTitle = under.long_title
  const underShortTitle = under.title

  const payouts = {
    optionOne: over.payout,
    optionTwo: under.payout,
  };

  const betOptionIDs ={
    optionOne: over.id,
    optionTwo: under.id
  }
  const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("overUnder", overLongTitle, underLongTitle, payouts, betOptionIDs, overShortTitle, underShortTitle, game);
  const { minBet, maxBet } = BETTING_RULES[betType];

  return (
    <View>
      <BetTypeHeading heading={"Over/Under"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={over.title}
          payout={over.payout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={under.title}
          payout={under.payout}
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
            payout={over.payout}
            betId={currentBetId}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            option="optionTwo"
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={under.payout}
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