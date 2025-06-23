// hooks/useConferences.js
import { useState, useCallback, useMemo } from "react";

export const MAIN_CONFERENCES = ["SEC", "Big 12", "Big Ten", "ACC"];
export const FILTER_CONFERENCES = [...MAIN_CONFERENCES, "Other"];

export function useConferences() {
  const [selectedConferences, setSelectedConferences] = useState([]);

  const normalizeConf = useCallback(
    (conf) => (MAIN_CONFERENCES.includes(conf) ? conf : "Other"),
    []
  );

  const toggleConference = useCallback((conf) => {
    setSelectedConferences((prev) =>
      prev.includes(conf)
        ? prev.filter((c) => c !== conf)
        : [...prev, conf]
    );
  }, []);

  const clearConferences = useCallback(() => {
    setSelectedConferences([]);
  }, []);

  // Now memoize your filterGames so its identity only changes when
  // games *or* selectedConferences actually change.
  const filterGames = useCallback(
    (games) => {
      if (selectedConferences.length === 0) return games;
      return games.filter((game) => {
        const home = normalizeConf(game.home_team.conference);
        const away = normalizeConf(game.away_team.conference);
        return (
          selectedConferences.includes(home) ||
          selectedConferences.includes(away)
        );
      });
    },
    [selectedConferences, normalizeConf]
  );

  return useMemo(
    () => ({
      selectedConferences,
      toggleConference,
      clearConferences,
      filterGames,
      FILTER_CONFERENCES,
    }),
    [
      selectedConferences,
      toggleConference,
      clearConferences,
      filterGames,
    ]
  );
}
