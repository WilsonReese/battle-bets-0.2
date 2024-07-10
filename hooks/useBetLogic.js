import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useBetContext } from "../components/contexts/BetContext";
// import { useBetContext } from "../contexts/BetContext";
import { BETTING_RULES } from "../utils/betting-rules";

export const useBetLogic = (betType, optionOne, optionTwo, payout) => {
  const { bets, addBet, removeBet, getBetOptionType, getBudget, getTotalBetAmount } = useBetContext();
  const [selection, setSelection] = useState({ optionOne: false, optionTwo: false });
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [currentBetId, setCurrentBetId] = useState(null);
  const budget = getBudget(getBetOptionType(betType));
  const totalBetAmount = getTotalBetAmount(getBetOptionType(betType))
  const isEnabled = totalBetAmount < budget;
  const { minBet, maxBet } = BETTING_RULES[betType];

  // animates opening the bet selector
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

  // listens for changes in the bets and sets the selection to option one or two
  useEffect(() => {
    const selectedBet = bets.find((bet) => bet.id === currentBetId);
    if (selectedBet) {
      setSelection({
        optionOne: selectedBet.name === optionOne,
        optionTwo: selectedBet.name === optionTwo,
      });
    } else {
      setSelection({ optionOne: false, optionTwo: false });
    }
  }, [bets, currentBetId, optionOne, optionTwo]);

  // listens for opening option one or option two
  useEffect(() => {
    const betOptionOne = bets.find((bet) => bet.name === optionOne && bet.betType === betType);
    const betOptionTwo = bets.find((bet) => bet.name === optionTwo && bet.betType === betType);

    if (betOptionOne) {
      setSelection({ optionOne: true, optionTwo: false });
      setCurrentBetId(betOptionOne.id);
    } else if (betOptionTwo) {
      setSelection({ optionOne: false, optionTwo: true });
      setCurrentBetId(betOptionTwo.id);
    }
  }, [optionOne, optionTwo, bets]);

  // gets title for bet ex: 'Vanderbilt -6.5'
  const getTitle = (type) => {
    return type === "optionOne" ? optionOne : optionTwo;
  };

  const selectBet = (type) => {
    const title = getTitle(type);
    setSelection({ [type]: true });
    const newBet = addBet({
      title: title,
      betAmount: minBet,
      payout: payout,
      betType: betType,
    });
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
      const title = getTitle(type);
      setSelection({ [type]: true });
      const newBet = addBet({
        title: title,
        betAmount: minBet,
        payout: payout,
        betType: betType,
      });
      setCurrentBetId(newBet.id);
    }
  };

  return { selection, isEnabled, animatedHeight, toggleBet, betType, currentBetId };
};