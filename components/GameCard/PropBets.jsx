import { Animated, StyleSheet, View } from "react-native";
import { BetTypeHeading } from "./BetTypeHeading";
import { BetSelector } from "./BetSelector";
import { BetOption } from "./BetOption";
import { useBetLogic } from "../../hooks/useBetLogic";
import { BETTING_RULES } from "../../utils/betting-rules";

export function PropBets({ betOptions }) {
    const renderPropOptions = (betOptions) => {
      return betOptions.map((option) => {
        const { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId } = useBetLogic("prop", option.name, option.name, option.payout, option.id);
        const { minBet, maxBet } = BETTING_RULES[betType];
  
        return (
          <View key={option.name}>
            <BetOption
              title={option.name}
              payout={option.payout}
              isSelected={selection.optionOne}
              isEnabled={isEnabled}
              onPress={() => toggleBet("optionOne")}
            />
            <Animated.View style={[s.betSelectorContainer, { height: animatedHeight, overflow: "hidden" }]}>
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
        <BetTypeHeading heading={"Prop Bets"} />
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
