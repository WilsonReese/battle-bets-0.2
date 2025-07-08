// components/contexts/ScoreboardContext.js
import { createContext, useContext, useState } from "react";

const ScoreboardContext = createContext();

export const ScoreboardProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameData, setSelectedGameData] = useState(null);
  const [selectedHomeTeamStats, setSelectedHomeTeamStats] = useState(null);
  const [selectedAwayTeamStats, setSelectedAwayTeamStats] = useState(null);
  const [selectedHomePlayerStats, setSelectedHomePlayerStats] = useState(null);
  const [selectedAwayPlayerStats, setSelectedAwayPlayerStats] = useState(null);

  const [userBets, setUserBets] = useState(null);
  const gameStatus = 'inProgress'

  return (
    <ScoreboardContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        selectedGameData,
        setSelectedGameData,
        selectedHomeTeamStats,
        setSelectedHomeTeamStats,
        selectedAwayTeamStats,
        setSelectedAwayTeamStats,
        selectedHomePlayerStats,
        setSelectedHomePlayerStats,
        selectedAwayPlayerStats,
        setSelectedAwayPlayerStats,

        userBets, 
        setUserBets,
        gameStatus
      }}
    >
      {children}
    </ScoreboardContext.Provider>
  );
};

export const useScoreboard = () => useContext(ScoreboardContext);
