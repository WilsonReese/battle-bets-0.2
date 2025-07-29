import { create } from "zustand";
import api from "../utils/axiosConfig";

export const usePoolStore = create((set, get) => ({
  pools: {},

  // fetchAllPoolData now fetches:
  //  • pool.details
  //  • league seasons → pick 2025
  //  • battles
  //  • user‐only betslips per battle
  //  • standings + userEntry
  fetchAllPoolData: async (poolId, { skipLoading = false } = {}) => {
    const prev = get().pools[poolId] || {};

    if (!skipLoading) {
      // turn on loading
      set(state => ({
        pools: {
          ...state.pools,
          [poolId]: { ...prev, loading: true },
        },
      }));
    }

    try {
      // 1) pool details
      const poolRes = await api.get(`/pools/${poolId}`);

      // 2) league seasons → find season 2025
      const seasonsRes = await api.get(`/pools/${poolId}/league_seasons`);
      const selectedSeason = seasonsRes.data.find(
        (ls) => ls.season.year === 2025
      );
      if (!selectedSeason) throw new Error("No 2025 season");

      // 3) battles
      const battlesRes = await api.get(
        `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles`
      );

      // 4) per‐battle user‐only betslips
      const betslipsByBattle = {};
      await Promise.all(
        battlesRes.data.map(async (b) => {
          try {
            const r = await api.get(
              `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles/${b.id}/betslips?user_only=true`
            );
            betslipsByBattle[b.id] = r.data;
          } catch {
            betslipsByBattle[b.id] = null;
          }
        })
      );

      // 5) standings + userEntry
      const standingsRes = await api.get(
        `/pools/${poolId}/league_seasons/${selectedSeason.id}/leaderboard_entries`
      );
      let userEntry = null;
      try {
        const ue = await api.get(
          `/pools/${poolId}/league_seasons/${selectedSeason.id}/leaderboard_entries?user_only=true`
        );
        userEntry = ue.data;
      } catch {
        /* 404 if no entry yet */
      }

      // 6) memberships
      const membersRes = await api.get(
        `/pools/${poolId}/pool_memberships`
      );

      // Finally commit all
      set((state) => ({
        pools: {
          ...state.pools,
          [poolId]: {
            loading: false,
            details: poolRes.data,
            selectedSeason,
            battles: battlesRes.data,
            userBetslipByBattle: betslipsByBattle,
            standings: standingsRes.data,
            userEntry,
            memberships: membersRes.data,
          },
        },
      }));
    } catch (err) {
      console.error("Error fetching pool data:", err);
      // leave previous data but turn off loading
      set((state) => ({
        pools: {
          ...state.pools,
          [poolId]: { ...(state.pools[poolId] || {}), loading: false },
        },
      }));
    }
  },
}));