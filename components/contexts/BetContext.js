import React, { createContext, useState, useContext } from "react";
import uuid from "react-native-uuid";

const BetContext = createContext();

export const useBetContext = () => useContext(BetContext);

export const BetProvider = ({ children }) => {
  const [bets, setBets] = useState([]);

  const addBet = ({ title, betAmount, payout }) => {
    const newBet = {
      id: uuid.v4(),
      name: title,
      betAmount,
      toWinAmount: betAmount * payout,
    };
    setBets((prevBets) => [...prevBets, newBet]);
  };

  const removeBet = (id) => {
    setBets((prevBets) => prevBets.filter((bet) => bet.id !== id));
  };

  const updateBet = (id, newBetAmount, payout) => {
    setBets((prevBets) =>
      prevBets.map((bet) =>
        bet.id === id
          ? {
              ...bet,
              betAmount: newBetAmount,
              toWinAmount: newBetAmount * payout,
            }
          : bet
      )
    );
  };

  return (
    <BetContext.Provider value={{ bets, addBet, removeBet, updateBet }}>
      {children}
    </BetContext.Provider>
  );
};
