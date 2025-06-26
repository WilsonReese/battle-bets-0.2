// hooks/useBattleLeaderboard.js
import { useCallback, useEffect, useState } from "react";
import api from "../utils/axiosConfig";

export function useBattleLeaderboard(poolId, leagueSeasonId, battleId) {
	const [betslips, setBetslips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchBetslips = useCallback(async () => {
		if (!poolId || !leagueSeasonId || !battleId) return;

		setLoading(true);
		setError(null);

		try {
			const response = await api.get(
				`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips`
			);

			const sorted = response.data.sort((a, b) => {
				if (b.earnings !== a.earnings) return b.earnings - a.earnings;
				return b.max_payout_remaining - a.max_payout_remaining;
			});

			// Assign ranks and hitRate
			const ranked = [];
			let currentRank = 1;
			let tieCount = 0;

			for (let i = 0; i < sorted.length; i++) {
				const betslip = sorted[i];
				const prev = sorted[i - 1];

				const isTied =
					i > 0 &&
					betslip.earnings === prev.earnings &&
					betslip.max_payout_remaining === prev.max_payout_remaining;

				if (!isTied) {
					currentRank = currentRank + tieCount;
					tieCount = 1;
				} else {
					tieCount++;
				}

				const totalBets = betslip.bets?.length ?? 0;
				const successfulBets =
					betslip.bets?.filter((b) => b.bet_option?.success === true).length ??
					0;

				const failedBets =
					betslip.bets?.filter((b) => b.bet_option?.success === false).length ??
					0;

				const hitRate =
					successfulBets + failedBets > 0
						? (successfulBets / (successfulBets + failedBets)) * 100
						: null;

				ranked.push({
					...betslip,
					rank: currentRank,
					hitRate: hitRate?.toFixed(0),
				});
			}

			setBetslips(ranked);
		} catch (err) {
			console.error("Error loading betslips:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	}, [poolId, leagueSeasonId, battleId]);

	useEffect(() => {
		fetchBetslips();
	}, [fetchBetslips]);

	// useEffect(() => {
	//   if (!poolId || !leagueSeasonId || !battleId) return;

	//   const fetchBetslips = async () => {
	//     setLoading(true);
	//     try {
	//       const response = await api.get(
	//         `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips`
	//       );

	//       const sorted = response.data.sort((a, b) => {
	//         if (b.earnings !== a.earnings) return b.earnings - a.earnings;
	//         return b.max_payout_remaining - a.max_payout_remaining;
	//       });

	//       // Assign ranks and hitRate
	//       const ranked = [];
	//       let currentRank = 1;
	//       let tieCount = 0;

	//       for (let i = 0; i < sorted.length; i++) {
	//         const betslip = sorted[i];
	//         const prev = sorted[i - 1];

	//         const isTied =
	//           i > 0 &&
	//           betslip.earnings === prev.earnings &&
	//           betslip.max_payout_remaining === prev.max_payout_remaining;

	//         if (!isTied) {
	//           currentRank = currentRank + tieCount;
	//           tieCount = 1;
	//         } else {
	//           tieCount++;
	//         }

	//         const totalBets = betslip.bets?.length ?? 0;
	//         const successfulBets = betslip.bets?.filter(
	//           (b) => b.bet_option?.success === true
	//         ).length ?? 0;

	//         const failedBets = betslip.bets?.filter(
	//           (b) => b.bet_option?.success === false
	//         ).length ?? 0;

	//         const hitRate = (successfulBets + failedBets) > 0 ? (successfulBets / (successfulBets + failedBets)) * 100 : null;

	//         ranked.push({
	//           ...betslip,
	//           rank: currentRank,
	//           hitRate: hitRate?.toFixed(0), // as a clean integer percentage string like "80"
	//         });
	//       }

	//       setBetslips(ranked);
	//     } catch (err) {
	//       console.error("Error loading betslips:", err);
	//       setError(err);
	//     } finally {
	//       setLoading(false);
	//     }
	//   };

	//   fetchBetslips();
	// }, [poolId, leagueSeasonId, battleId]);

	return { betslips, loading, error, refetch: fetchBetslips };
}
