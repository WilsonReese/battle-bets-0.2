import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useBetContext } from "../components/contexts/BetContext";
import { BETTING_RULES } from "../utils/betting-rules";

export const useBetLogic = (betType, optionOne, optionTwo, payouts, betOptionIDs) => {
  const { bets, addBet, removeBet, getBetOptionType, getBudget, getTotalBetAmount } = useBetContext();
  const [selection, setSelection] = useState({ optionOne: false, optionTwo: false });
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [currentBetId, setCurrentBetId] = useState(null);
  const budget = getBudget(getBetOptionType(betType));
  const totalBetAmount = getTotalBetAmount(getBetOptionType(betType));
  const isEnabled = totalBetAmount < budget;
  const { minBet, maxBet } = BETTING_RULES[betType];

  // Animates opening the bet selector
  useEffect(() => {
    if (selection.optionOne || selection.optionTwo) {
      Animated.timing(animatedHeight, {
        toValue: 54,
        duration: 150,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [selection]);

    // Sets the selection state based on the loaded bets
    useEffect(() => {
      const selectedBet = bets.find((bet) => 
        (bet.name === optionOne || bet.name === optionTwo) && bet.betType === betType
      );
  
      if (selectedBet) {
        setSelection({
          optionOne: selectedBet.name === optionOne,
          optionTwo: selectedBet.name === optionTwo,
        });
        setCurrentBetId(selectedBet.id);
      } else {
        setSelection({ optionOne: false, optionTwo: false });
      }
    }, [bets, optionOne, optionTwo, betType]);

  // Gets title for bet e.g., 'Vanderbilt -6.5'
  const getTitle = (type) => {
    return type === "optionOne" ? optionOne : optionTwo;
  };

  const selectBet = (type) => {
    const title = getTitle(type);
    const payout = payouts[type]; // Get the correct payout based on the type
    const betOptionID = betOptionIDs[type]
    setSelection({ [type]: true });
    const newBet = addBet({
      title: title,
      betAmount: minBet,
      payout: payout,
      betType: betType,
      betOptionID: betOptionID
    });
    console.log("useBetLogic, Selected Bet:", newBet)
    setCurrentBetId(newBet.id);
  };

  const deselectBet = () => {
    removeBet(currentBetId);
    setCurrentBetId(null);
    setSelection({ optionOne: false, optionTwo: false });
  };

  const toggleBet = (type) => {
    if (!selection.optionOne && !selection.optionTwo) {
      selectBet(type);
    } else if (selection[type]) {
      deselectBet();
    } else {
      removeBet(currentBetId);
      selectBet(type);
    }
  };

  return { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId };
};