// hooks/useBattleLeaderboard.js
import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

export function useBattleLeaderboard(poolId, leagueSeasonId, battleId) {
  const [betslips, setBetslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!poolId || !leagueSeasonId || !battleId) return;

    const fetchBetslips = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips`
        );

        const sorted = response.data.sort((a, b) => {
          if (b.earnings !== a.earnings) return b.earnings - a.earnings;
          return b.max_payout_remaining - a.max_payout_remaining;
        });

        // Assign ranks with tie logic (skip ranks for ties)
        const ranked = [];
        let currentRank = 1;
        let tieCount = 0;

        for (let i = 0; i < sorted.length; i++) {
          const current = sorted[i];
          const prev = sorted[i - 1];

          const isTied =
            i > 0 &&
            current.earnings === prev.earnings &&
            current.max_payout_remaining === prev.max_payout_remaining;

          if (!isTied) {
            currentRank = currentRank + tieCount;
            tieCount = 1;
          } else {
            tieCount++;
          }

          ranked.push({ ...current, rank: currentRank });
        }

        setBetslips(ranked);
      } catch (err) {
        console.error("Error loading betslips:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBetslips();
  }, [poolId, leagueSeasonId, battleId]);

  return { betslips, loading, error };
}