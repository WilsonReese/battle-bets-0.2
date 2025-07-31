// components/contexts/ScoreboardContext.js
import { createContext, useContext, useState } from "react";

const ScoreboardContext = createContext();

export const ScoreboardProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameData, setSelectedGameData] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);

  const [userBets, setUserBets] = useState(null);
  // const gameStatus = 'postgame'

  return (
    <ScoreboardContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        selectedGameData,
        setSelectedGameData,
        
        gameStatus,
        setGameStatus,

        userBets, 
        setUserBets,
      }}
    >
      {children}
    </ScoreboardContext.Provider>
  );
};

export const useScoreboard = () => useContext(ScoreboardContext);
