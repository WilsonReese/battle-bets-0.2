import React, { createContext, useState, useContext } from "react";
import uuid from "react-native-uuid";

const BetContext = createContext();

export const useBetContext = () => useContext(BetContext);

export const BetProvider = ({ children }) => {
  const [bets, setBets] = useState([]);
  const [spreadOUBudget, setSpreadOUBudget] = useState(2000); // Initial budget for spread and OU
  const [moneyLineBudget, setMoneyLineBudget] = useState(1000); // Initial budget for money line
  const [propBetBudget, setPropBetBudget] = useState(500); // Initial budget for prop bets
  const [totalSpreadOUBet, setTotalSpreadOUBet] = useState(0);
  const [totalMoneyLineBet, setTotalMoneyLineBet] = useState(0);
  const [totalPropBet, setTotalPropBet] = useState(0);
  const [betOptionType, setBetOptionType] = useState('spreadOU'); // sets SpreadOU as initial bet option type state

  const updateTotalBetState = (betOptionType, amount, operation) => {
    const stateSetters = {
      spreadOU: setTotalSpreadOUBet,
      moneyLine: setTotalMoneyLineBet,
      prop: setTotalPropBet,
    };
    const setter = stateSetters[betOptionType];

    if (setter) {
      setter((prevTotal) => {
        switch (operation) {
          case "add":
            return prevTotal + amount;
          case "remove":
            return prevTotal - amount;
          case "update":
            return prevTotal + amount; // Assuming update means incrementing by the amount
          default:
            return prevTotal;
        }
      });
    }
  };

  const addBet = ({ title, betAmount, payout, betType }) => {
    const newBet = {
      id: uuid.v4(),
      name: title,
      betAmount,
      toWinAmount: betAmount * payout,
      betType: betType,
    };
    setBets((prevBets) => [...prevBets, newBet]);
    updateTotalBetState(getBetOptionType(betType), betAmount, "add");
    return newBet;
  };

  const removeBet = (id) => {
    const betToRemove = bets.find((bet) => bet.id === id);
    if (betToRemove) {
      setBets((prevBets) => prevBets.filter((bet) => bet.id !== id));
      updateTotalBetState(getBetOptionType(betToRemove.betType), betToRemove.betAmount, "remove");
    }
  };

  const updateBet = (id, newBetAmount, payout) => {
    const previousBet = bets.find((bet) => bet.id === id);
    const previousBetAmount = previousBet ? previousBet.betAmount : 0;

    const updatedBets = bets.map((bet) =>
      bet.id === id
        ? {
            ...bet,
            betAmount: newBetAmount,
            toWinAmount: newBetAmount * payout,
          }
        : bet
    );

    setBets(updatedBets);
    updateTotalBetState(getBetOptionType(previousBet.betType), newBetAmount - previousBetAmount, "update");
  };

  const getBetOptionType = (betType) => {
    const betTypeToOptionType = {
      spread: "spreadOU",
      ou: "spreadOU",
      moneyLine: "moneyLine",
      prop: "prop",
    };
    return betTypeToOptionType[betType] || "spreadOU"; // Default to "spreadOU" if not found
  };

  const getBudget = (betOptionType) => {
    const budgetByBetOptionType = {
      spreadOU: spreadOUBudget,
      moneyLine: moneyLineBudget,
      prop: propBetBudget,
    };
    return budgetByBetOptionType[betOptionType];
  };

  const getTotalBetAmount = (betOptionType) => {
    const totalBetAmountByBetOptionType = {
      spreadOU: totalSpreadOUBet,
      moneyLine: totalMoneyLineBet,
      prop: totalPropBet,
    };
    return totalBetAmountByBetOptionType[betOptionType] || 0;
  };

  const getBetOptionLongTitle = (betOptionType) => {
    const betOptionLongTitleByType = {
      spreadOU: 'Spread and Over/Under',
      moneyLine: 'Money Line',
      prop: 'Prop Bets',
    };
    return betOptionLongTitleByType[betOptionType]
  }

  const areAllBetsComplete = () => {
    return (
      totalSpreadOUBet === spreadOUBudget &&
      totalMoneyLineBet === moneyLineBudget &&
      totalPropBet === propBetBudget
    );
  };

  return (
    <BetContext.Provider
      value={{
        bets,
        addBet,
        removeBet,
        updateBet,
        spreadOUBudget,
        setSpreadOUBudget,
        totalSpreadOUBet,
        moneyLineBudget,
        setMoneyLineBudget,
        totalMoneyLineBet,
        propBetBudget,
        setPropBetBudget,
        totalPropBet,
        betOptionType,
        setBetOptionType, 
        getBetOptionType,
        getBudget,
        getTotalBetAmount,
        getBetOptionLongTitle, 
        areAllBetsComplete,
      }}
    >
      {children}
    </BetContext.Provider>
  );
};