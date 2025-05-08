// hooks/usePoolDetails.js
import { useCallback, useEffect, useState } from "react";
import api from "../utils/axiosConfig";

export const usePoolDetails = (poolId) => {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [battles, setBattles] = useState([]);
  const [userBetslip, setUserBetslip] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSeasons = useCallback(async () => {
    try {
      const response = await api.get(`/pools/${poolId}/league_seasons`);
      const allLeagueSeasons = response.data;
      const desiredSeason = allLeagueSeasons.find(
        (leagueSeason) => leagueSeason.season.year === 2024
      );

      if (!desiredSeason) {
        console.error("No league season found for 2024.");
        setLoading(false);
        return;
      }

      setSelectedSeason({
        ...desiredSeason,
        hasStarted: desiredSeason["has_started?"],
      });
    } catch (error) {
      console.error("Error fetching league seasons:", error.response || error);
      setLoading(false);
    }
  }, [poolId]);

  const fetchBattles = useCallback(async () => {
    if (!selectedSeason) return;

    try {
      const battlesResponse = await api.get(
        `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles`
      );
      const fetchedBattles = battlesResponse.data;

      if (fetchedBattles.length === 0) {
        console.error("No battles found for this pool.");
        setLoading(false);
        return;
      }

      setBattles(fetchedBattles);

      const latestBattle = fetchedBattles[0];
      const betslipsResponse = await api.get(
        `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles/${latestBattle.id}/betslips?user_only=true`
      );
      setUserBetslip(betslipsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching battles:", error.response || error);
      setLoading(false);
    }
  }, [poolId, selectedSeason]);

  const fetchPoolMemberships = useCallback(async () => {
    try {
      const response = await api.get(`/pools/${poolId}/pool_memberships`);
      setMemberships(response.data);
    } catch (error) {
      console.error("Error fetching pool memberships:", error.response || error);
    }
  }, [poolId]);

  useEffect(() => {
    if (poolId) {
      fetchPoolMemberships();
    }
  }, [poolId, fetchPoolMemberships]);

  useEffect(() => {
    if (selectedSeason?.hasStarted) {
      fetchBattles();
    } else if (selectedSeason && !selectedSeason.hasStarted) {
      setLoading(false);
    }
  }, [selectedSeason, fetchBattles]);

  return {
    selectedSeason,
    battles,
    setBattles,
    memberships,
    setMemberships,
    userBetslip,
    setUserBetslip,
    fetchSeasons,
    fetchBattles,
    fetchPoolMemberships,
    loading,
    setLoading,
  };
};
