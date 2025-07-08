import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "./BetTypeHeading";
import { BetSelector } from "./BetSelector";
import { BetOption } from "./BetOption";
import { useBetLogic } from "../../hooks/useBetLogic";
import { BETTING_RULES } from "../../utils/betting-rules";

export function PropBets({ betOptions, homeTeam, awayTeam, game }) {

  console.log("🔄 Prop Bets rendered for game", game.id);

  const renderPropOptions = (betOptions) => {
    return betOptions.map((option) => {
      const payouts = {
        optionOne: option.payout,
        optionTwo: option.payout, // we include this because BetLogic expects it to be there
      };
      const betOptionIDs ={
        optionOne: option.id,
        optionTwo: option.id
      }
      const optionLongTitle = option.long_title
      const optionShortTitle = option.title
      const {
        selection,
        isEnabled,
        animatedHeight,
        toggleBet,
        betType,
        currentBetId,
      } = useBetLogic("prop", optionLongTitle, optionLongTitle, payouts, betOptionIDs, optionShortTitle, optionShortTitle, game);
      const { minBet, maxBet } = BETTING_RULES[betType];

      return (
        <View key={option.title}>
          <BetOption
            title={option.title}
            payout={option.payout}
            isSelected={selection.optionOne}
            isEnabled={isEnabled}
            onPress={() => toggleBet("optionOne")}
          />
          <Animated.View
            style={[
              s.betSelectorContainer,
              { height: animatedHeight, overflow: "hidden" },
            ]}
          >
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
      );
    });
  };

  return (
    <View>
      {betOptions && <BetTypeHeading heading={"Prop Bets"} />}
      {renderPropOptions(betOptions)}
    </View>
  );
}

const s = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
  },
  betSelectorContainer: {
    marginBottom: 4,
  },
});
