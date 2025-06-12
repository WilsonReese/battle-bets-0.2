// components/contexts/ScoreboardContext.js
import { createContext, useContext, useState } from "react";

const ScoreboardContext = createContext();

export const ScoreboardProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameData, setSelectedGameData] = useState(null);
  const [selectedHomeTeamStats, setSelectedHomeTeamStats] = useState(null);
  const [selectedAwayTeamStats, setSelectedAwayTeamStats] = useState(null);
  const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);

  return (
    <ScoreboardContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        selectedGameData,
        setSelectedGameData,
        selectedHomeTeamStats,
        setSelectedHomeTeamStats,
        selectedPlayerStats,
        setSelectedPlayerStats,
        selectedAwayTeamStats,
        setSelectedAwayTeamStats,
      }}
    >
      {children}
    </ScoreboardContext.Provider>
  );
};

export const useScoreboard = () => useContext(ScoreboardContext);
