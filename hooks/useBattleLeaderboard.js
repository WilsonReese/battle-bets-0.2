// hooks/useBattleLeaderboard.js
import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

export function useBattleLeaderboard(poolId, leagueSeasonId, battleId) {
  const [betslips, setBetslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(
          `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips`
        );

        const sorted = response.data.sort((a, b) => {
          if (b.earnings !== a.earnings) return b.earnings - a.earnings;
          return b.max_payout_remaining - a.max_payout_remaining;
        });

        setBetslips(sorted);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [poolId, leagueSeasonId, battleId]);

  return { betslips, loading };
}
