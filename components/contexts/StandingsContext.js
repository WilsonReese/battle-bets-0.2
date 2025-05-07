import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../utils/axiosConfig";

// Create the context
const StandingsContext = createContext();

// Context provider component
export const StandingsProvider = ({ children }) => {
  const [standings, setStandings] = useState({});
  const [userLeaderboardEntries, setUserLeaderboardEntries] = useState({});
  const [loading, setLoading] = useState(false);

  // Function to fetch standings for a given pool and season
  const fetchStandings = async (poolId, seasonYear) => {
    setLoading(true);
    try {
      const response = await api.get(`/pools/${poolId}/league_seasons`);
      const season = response.data.find((ls) => ls.season.year === seasonYear);

      if (!season) {
        console.error(`No league season found for ${seasonYear}.`);
        return null;
      }

      const standingsResponse = await api.get(
        `/pools/${poolId}/league_seasons/${season.id}/leaderboard_entries`
      );

      // Fetch only the user's leaderboard entry
      let userEntry = null;
      try {
        const userResponse = await api.get(
          `/pools/${poolId}/league_seasons/${season.id}/leaderboard_entries?user_only=true`
        );
        userEntry = userResponse.data;
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("No user leaderboard entry yet. This is expected for new leagues.");
        } else {
          console.error("Error fetching user leaderboard entry:", err);
        }
      }

      setStandings((prev) => ({
        ...prev,
        [poolId]: {
          seasonId: season.id,
          entries: standingsResponse.data,
        },
      }));

      setUserLeaderboardEntries((prev) => ({
        ...prev,
        [poolId]: userEntry,
      }));
    } catch (error) {
      console.error("Error fetching standings:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandingsContext.Provider
      value={{ standings, userLeaderboardEntries, loading, fetchStandings }}
    >
      {children}
    </StandingsContext.Provider>
  );
};

// Custom hook for easy access
export const useStandings = () => {
  return useContext(StandingsContext);
};
