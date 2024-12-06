import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useBetLogic } from "../../../hooks/useBetLogic";
import { BETTING_RULES } from "../../../utils/betting-rules";

export function Spread({ spreadOptions, spreadHome, spreadAway, spreadPayout, homeTeam, awayTeam, game }) {
  if (!spreadOptions || spreadOptions.length < 2) {
    return null; // Ensure there are at least two options (home and away)
  }
  
  const awaySpread = spreadOptions[0]; // Assuming the first option is for the away team
  const homeSpread = spreadOptions[1]; // Assuming the second option is for the home team
  const awaySpreadLongTitle = awaySpread.long_title
  const awaySpreadShortTitle = awaySpread.title
  const homeSpreadLongTitle = homeSpread.long_title
  const homeSpreadShortTitle = homeSpread.title
  
  const payouts = {
    optionOne: awaySpread.payout,
    optionTwo: homeSpread.payout,
  };

  const betOptionIDs ={
    optionOne: awaySpread.id,
    optionTwo: homeSpread.id
  }
  // console.log(betOptionIDs)
  const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("spread", awaySpreadLongTitle, homeSpreadLongTitle, payouts, betOptionIDs, awaySpreadShortTitle, homeSpreadShortTitle, game);
  const { minBet, maxBet } = BETTING_RULES[betType];

  return (
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={awaySpread.title}
          payout={awaySpread.payout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={homeSpread.title}
          payout={homeSpread.payout}
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
            payout={awaySpread.payout}
            betId={currentBetId}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            option="optionTwo"
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={homeSpread.payout}
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