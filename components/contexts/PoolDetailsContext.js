import React, { createContext, useContext, useState, useCallback } from "react";
import { useEffect } from "react";
import api from "../../utils/axiosConfig";

const PoolDetailsContext = createContext();

export const PoolDetailsProvider = ({ children }) => {
  const [poolDetailsMap, setPoolDetailsMap] = useState({});

  const initPoolDetails = (poolId) => {
    setPoolDetailsMap((prev) => ({
      ...prev,
      [poolId]: {
        loading: true,
        poolDetails: null,
        selectedSeason: null,
        battles: [],
        userBetslip: null,
        memberships: [],
        standings: [],
        userEntry: null,
      },
    }));
  };

  const fetchPoolDetails = async (poolId) => {
    try {
      const res = await api.get(`/pools/${poolId}`);
      setPoolDetailsMap((prev) => ({
        ...prev,
        [poolId]: { ...prev[poolId], poolDetails: res.data },
      }));
    } catch (err) {
      console.error("Error fetching pool details:", err);
    }
  };

  const fetchPoolMemberships = async (poolId) => {
    try {
      const res = await api.get(`/pools/${poolId}/pool_memberships`);
      setPoolDetailsMap((prev) => ({
        ...prev,
        [poolId]: { ...prev[poolId], memberships: res.data },
      }));
    } catch (err) {
      console.error("Error fetching memberships:", err);
    }
  };

  const fetchSeasonsAndBattles = async (poolId, seasonYear = 2024) => {
    try {
      const seasonRes = await api.get(`/pools/${poolId}/league_seasons`);
      const selectedSeason = seasonRes.data.find(
        (ls) => ls.season.year === seasonYear
      );

      if (!selectedSeason) return;

      const battlesRes = await api.get(
        `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles`
      );
      const latestBattle = battlesRes.data?.[0];

      let userBetslip = null;
      if (latestBattle) {
        const betslipRes = await api.get(
          `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles/${latestBattle.id}/betslips?user_only=true`
        );
        userBetslip = betslipRes.data;
      }

      setPoolDetailsMap((prev) => ({
        ...prev,
        [poolId]: {
          ...prev[poolId],
          selectedSeason: {
            ...selectedSeason,
            hasStarted: selectedSeason["has_started?"],
          },
          battles: battlesRes.data,
          userBetslip,
        },
      }));
    } catch (err) {
      console.error("Error fetching seasons/battles/betslip:", err);
    }
  };

  const fetchStandings = async (poolId, seasonYear = 2024) => {
    try {
      const seasonRes = await api.get(`/pools/${poolId}/league_seasons`);
      const season = seasonRes.data.find((ls) => ls.season.year === seasonYear);
      if (!season) return;

      const standingsRes = await api.get(
        `/pools/${poolId}/league_seasons/${season.id}/leaderboard_entries`
      );

      let userEntry = null;
      try {
        const userRes = await api.get(
          `/pools/${poolId}/league_seasons/${season.id}/leaderboard_entries?user_only=true`
        );
        userEntry = userRes.data;
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("User leaderboard error:", err);
        }
      }

      setPoolDetailsMap((prev) => ({
        ...prev,
        [poolId]: {
          ...prev[poolId],
          standings: standingsRes.data,
          userEntry,
        },
      }));
    } catch (err) {
      console.error("Error fetching standings:", err);
    }
  };

  const fetchAllPoolData = async (poolId) => {
    initPoolDetails(poolId);
    await Promise.all([
      fetchPoolDetails(poolId),
      fetchPoolMemberships(poolId),
      fetchSeasonsAndBattles(poolId),
      fetchStandings(poolId),
    ]);
    setPoolDetailsMap((prev) => ({
      ...prev,
      [poolId]: {
        ...prev[poolId],
        loading: false,
      },
    }));
  };

  return (
    <PoolDetailsContext.Provider
      value={{
        poolDetailsMap,
        fetchAllPoolData,
        fetchStandings,
        setPoolDetailsMap,
      }}
    >
      {children}
    </PoolDetailsContext.Provider>
  );
};

export const usePoolDetails = (poolId) => {
  const { poolDetailsMap, fetchAllPoolData, fetchStandings, setPoolDetailsMap } =
    useContext(PoolDetailsContext);

  useEffect(() => {
    if (poolId && !poolDetailsMap[poolId]) {
      fetchAllPoolData(poolId);
    }
  }, [poolId]);

  const details = poolDetailsMap[poolId] || {
    loading: true,
    poolDetails: null,
    selectedSeason: null,
    battles: [],
    userBetslip: null,
    memberships: [],
    standings: [],
    userEntry: null,
  };

  return {
    ...details,
    fetchAllPoolData,
    fetchStandings,
    setPoolDetailsMap,
  };
};
