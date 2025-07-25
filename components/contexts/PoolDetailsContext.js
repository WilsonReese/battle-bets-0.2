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

	// const fetchSeasonsAndBattles = async (poolId, seasonYear = 2025) => {
	// 	try {
	// 		const seasonRes = await api.get(`/pools/${poolId}/league_seasons`);
	// 		const selectedSeason = seasonRes.data.find(
	// 			(ls) => ls.season.year === seasonYear
	// 		);

	// 		if (!selectedSeason) return;

	// 		const battlesRes = await api.get(
	// 			`/pools/${poolId}/league_seasons/${selectedSeason.id}/battles`
	// 		);

	// 		// const latestBattle = battlesRes.data?.[0];
	// 		const currentBattle = battlesRes.data?.find((b) => b.current === true);

	// 		if (!currentBattle) {
	// 			console.warn("⚠️ No current battle found");
	// 			// You might want to show an error or fallback here
	// 		}

	// 		let userBetslip = null;
	// 		if (currentBattle) {
	// 			const betslipRes = await api.get(
	// 				`/pools/${poolId}/league_seasons/${selectedSeason.id}/battles/${currentBattle.id}/betslips?user_only=true`
	// 			);
	// 			userBetslip = betslipRes.data;
	// 		}

	// 		setPoolDetailsMap((prev) => ({
	// 			...prev,
	// 			[poolId]: {
	// 				...prev[poolId],
	// 				selectedSeason: {
	// 					...selectedSeason,
	// 					hasStarted: selectedSeason["has_started?"],
	// 				},
	// 				battles: battlesRes.data,
	// 				userBetslip,
	// 			},
	// 		}));
	// 	} catch (err) {
	// 		console.error("Error fetching seasons/battles/betslip:", err);
	// 	}
	// };

	const fetchSeasonsAndBattles = async (poolId, seasonYear = 2025) => {
		try {
			const seasonRes = await api.get(`/pools/${poolId}/league_seasons`);
			const selectedSeason = seasonRes.data.find(
				(ls) => ls.season.year === seasonYear
			);

			if (!selectedSeason) return;

			const battlesRes = await api.get(
				`/pools/${poolId}/league_seasons/${selectedSeason.id}/battles`
			);

			const battles = battlesRes.data;
			const currentBattle = battles.find((b) => b.current);

			// 🆕 Fetch betslips for all battles (where user has one)
			const betslipsByBattle = {};
			await Promise.all(
				battles.map(async (battle) => {
					try {
						const betslipRes = await api.get(
							`/pools/${poolId}/league_seasons/${selectedSeason.id}/battles/${battle.id}/betslips?user_only=true`
						);
						betslipsByBattle[battle.id] = betslipRes.data;
					} catch (err) {
						// It’s okay if there's no betslip
					}
				})
			);

			setPoolDetailsMap((prev) => ({
				...prev,
				[poolId]: {
					...prev[poolId],
					selectedSeason: {
						...selectedSeason,
						hasStarted: selectedSeason["has_started?"],
					},
					battles,
					userBetslipByBattle: betslipsByBattle, // 🆕 store all
				},
			}));
		} catch (err) {
			console.error("Error fetching seasons/battles/betslip:", err);
		}
	};

	const fetchStandings = async (poolId, seasonYear = 2025) => {
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

	const fetchAllPoolData = async (poolId, { skipLoading = false } = {}) => {
		if (!skipLoading) initPoolDetails(poolId); // only reset state on initial load

		if (!skipLoading) {
			setPoolDetailsMap((prev) => ({
				...prev,
				[poolId]: {
					...prev[poolId],
					loading: true,
				},
			}));
		}

		await Promise.all([
			fetchPoolDetails(poolId),
			fetchPoolMemberships(poolId),
			fetchSeasonsAndBattles(poolId),
			fetchStandings(poolId),
		]);

		if (!skipLoading) {
			setPoolDetailsMap((prev) => ({
				...prev,
				[poolId]: {
					...prev[poolId],
					loading: false,
				},
			}));
		}
	};

	const setUserBetslipForPool = (poolId, betslip) => {
		setPoolDetailsMap((prev) => ({
			...prev,
			[poolId]: {
				...prev[poolId],
				userBetslip: betslip,
			},
		}));
	};

	const setBattlesForPool = (poolId, battles) => {
		setPoolDetailsMap((prev) => ({
			...prev,
			[poolId]: {
				...prev[poolId],
				battles,
			},
		}));
	};

	const setLoadingForPool = (poolId, loading) => {
		setPoolDetailsMap((prev) => ({
			...prev,
			[poolId]: {
				...prev[poolId],
				loading,
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
				setUserBetslipForPool,
				setBattlesForPool,
				setLoadingForPool,
			}}
		>
			{children}
		</PoolDetailsContext.Provider>
	);
};

export const usePoolDetails = (poolId) => {
	const {
		poolDetailsMap,
		fetchAllPoolData,
		fetchStandings,
		userPools,
		setPoolDetailsMap,
		setUserBetslipForPool,
		setBattlesForPool,
		setLoadingForPool,
	} = useContext(PoolDetailsContext);

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
		setBattles: (battles) => setBattlesForPool(poolId, battles),
		setUserBetslip: (betslip) => setUserBetslipForPool(poolId, betslip),
		setLoading: (loading) => setLoadingForPool(poolId, loading),
	};
};
