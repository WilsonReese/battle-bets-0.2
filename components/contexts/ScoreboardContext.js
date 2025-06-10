// components/contexts/ScoreboardContext.js
import { createContext, useContext, useState } from "react";

const ScoreboardContext = createContext();

export const ScoreboardProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameData, setSelectedGameData] = useState(null)

  return (
    <ScoreboardContext.Provider value={{ selectedGame, setSelectedGame, selectedGameData, setSelectedGameData }}>
      {children}
    </ScoreboardContext.Provider>
  );
};

export const useScoreboard = () => useContext(ScoreboardContext);