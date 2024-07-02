import React, { createContext, useState, useContext } from 'react';

const BetContext = createContext();

export const useBetContext = () => useContext(BetContext);

export const BetProvider = ({ children }) => {
  const [bets, setBets] = useState([]);

  const addBet = (bet) => {
    setBets((prevBets) => [...prevBets, bet]);
  };

  const removeBet = (betId) => {
    setBets((prevBets) => prevBets.filter((bet) => bet.id !== betId));
  };

  const updateBet = (id, newBetAmount) => {
    setBets((prevBets) =>
      prevBets.map((bet) =>
        bet.id === id ? { ...bet, betAmount: newBetAmount } : bet
      )
    );
  };

  return (
    <BetContext.Provider value={{ bets, addBet, removeBet, updateBet }}>
      {children}
    </BetContext.Provider>
  );
};