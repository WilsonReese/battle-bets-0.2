import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import { BetSelector } from "../BetSelector";
import { BetOption } from "../BetOption";
import { useBetLogic } from "../../../hooks/useBetLogic";
import { BETTING_RULES } from "../../../utils/betting-rules";

export function Spread({ spreadOptions, spreadHome, spreadAway, spreadPayout, homeTeam, awayTeam }) {
  if (!spreadOptions || spreadOptions.length < 2) {
    return null; // Ensure there are at least two options (home and away)
  }
  
  const homeSpread = spreadOptions[0]; // Assuming the first option is for the home team
  const awaySpread = spreadOptions[1]; // Assuming the second option is for the away team
  const homeSpreadLongTitle = `${homeTeam} v ${awayTeam}: ${homeSpread.title}`;
  const awaySpreadLongTitle = `${homeTeam} v ${awayTeam}: ${awaySpread.title}`;
  
  const payouts = {
    optionOne: homeSpread.payout,
    optionTwo: awaySpread.payout,
  };
  const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("spread", homeSpreadLongTitle, awaySpreadLongTitle, payouts);
  const { minBet, maxBet } = BETTING_RULES[betType];

  return (
    <View>
      <BetTypeHeading heading={"SPREAD"} />
      <View style={s.optionsContainer}>
        <BetOption
          title={homeSpread.title}
          payout={homeSpread.payout}
          isSelected={selection.optionOne}
          isEnabled={isEnabled}
          onPress={() => toggleBet("optionOne")}
        />
        <View style={{ padding: 4 }}></View>
        <BetOption
          title={awaySpread.title}
          payout={awaySpread.payout}
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
            payout={homeSpread.payout}
            betId={currentBetId}
          />
        )}
        {selection.optionTwo && (
          <BetSelector
            option="optionTwo"
            closeSelection={() => toggleBet("optionTwo")}
            minBet={minBet}
            maxBet={maxBet}
            payout={awaySpread.payout}
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