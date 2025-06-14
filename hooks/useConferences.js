// hooks/useConferences.js
import { useState, useMemo } from "react";

export const MAIN_CONFERENCES = ["SEC", "Big 12", "Big Ten", "ACC"];
export const FILTER_CONFERENCES = [...MAIN_CONFERENCES, "Other"];

export function useConferences() {
  const [selectedConferences, setSelectedConferences] = useState([]);

  const normalizeConf = (conf) =>
    MAIN_CONFERENCES.includes(conf) ? conf : "Other";

  const toggleConference = (conf) => {
    setSelectedConferences((prev) =>
      prev.includes(conf) ? prev.filter((c) => c !== conf) : [...prev, conf]
    );
  };

  const clearConferences = () => {
    setSelectedConferences([]); // none = all
  };

  const filterGames = (games) =>
    games.filter((game) => {
      const homeConf = normalizeConf(game.home_team?.conference);
      const awayConf = normalizeConf(game.away_team?.conference);

      if (selectedConferences.length === 0) return true;

      return (
        selectedConferences.includes(homeConf) ||
        selectedConferences.includes(awayConf)
      );
    });

  return {
    selectedConferences,
    toggleConference,
    clearConferences,
    filterGames,
    FILTER_CONFERENCES,
  };
}