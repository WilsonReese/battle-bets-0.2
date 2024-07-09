import React, { createContext, useState, useContext } from "react";
import uuid from "react-native-uuid";

const BetContext = createContext();

export const useBetContext = () => useContext(BetContext);

export const BetProvider = ({ children }) => {
  const [bets, setBets] = useState([]);
  const [spreadOUBudget, setSpreadOUBudget] = useState(2000); // Initial budget
  const [totalBet, setTotalBet] = useState(0);
  const [betOptionType, setBetOptionType] = useState('spreadOU')

  const addBet = ({ title, betAmount, payout, betType }) => {
    const newBet = {
      id: uuid.v4(),
      name: title,
      betAmount,
      toWinAmount: betAmount * payout,
      betType: betType,
    };
    setBets((prevBets) => [...prevBets, newBet]);
    setTotalBet((prevTotalBet) => prevTotalBet + betAmount);
    return newBet;
  };

  const removeBet = (id) => {
    const betToRemove = bets.find((bet) => bet.id === id);
    if (betToRemove) {
      setTotalBet((prevTotalBet) => prevTotalBet - betToRemove.betAmount);
    }
    setBets((prevBets) => prevBets.filter((bet) => bet.id !== id));
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
    setTotalBet(
      (prevTotalBet) => prevTotalBet - previousBetAmount + newBetAmount
    );
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

  return (
    <BetContext.Provider
      value={{
        bets,
        addBet,
        removeBet,
        updateBet,
        spreadOUBudget,
        setSpreadOUBudget,
        totalBet,
        setTotalBet,
        betOptionType,
        setBetOptionType, 
        getBetOptionType,
      }}
    >
      {children}
    </BetContext.Provider>
  );
};
