import { create } from "zustand";
import { DEFAULT_BUDGETS } from "../utils/betting-rules";
import api from "../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import isEqual from "lodash.isequal";
// import { isEqual } from "date-fns";

// Load Bets
// Save Bets
// Get Total Amount Bet

export const useBetStore = create((set, get) => ({
	bets: [],
	budgetStatus: {
		spreadOU: false,
		moneyLine: false,
		prop: false,
	},
	betsToRemove: [], // array of bet IDs to delete on save
	initialBetsSnapshot: [], // what we loaded from backend on mount

	// ===== Add, Remove, Update Bets ====

	addBet: (newBet) => {
		const filtered = get().bets.filter(
			(b) => b.bet_option_id !== newBet.bet_option_id
		);
		const updatedBets = [...filtered, { ...newBet, addedAt: Date.now() }];

		set({ bets: updatedBets });

		get().updateBudgetStatus(updatedBets); // ← recalculate budgets after adding
	},

	// removeBet: (betOptionId) => {
	// 	const updatedBets = get().bets.filter(
	// 		(b) => b.bet_option_id !== betOptionId
	// 	);
	// 	set({ bets: updatedBets });

	// 	get().updateBudgetStatus(updatedBets);
	// },
	removeBet: (betOptionId) => {
		const { bets } = get();
		const toRemove = bets.find((b) => b.bet_option_id === betOptionId);
		set({
			bets: bets.filter((b) => b.bet_option_id !== betOptionId),
			betsToRemove: toRemove?.id
				? [...get().betsToRemove, toRemove.id]
				: get().betsToRemove,
		});
		get().updateBudgetStatus(get().bets);
	},

	updateBet: (bet_option_id, newAmount) => {
		const bets = get().bets;
		const betIndex = bets.findIndex((b) => b.bet_option_id === bet_option_id);
		if (betIndex === -1) return;

		const updatedBet = {
			...bets[betIndex],
			bet_amount: newAmount,
			to_win_amount: Math.round(newAmount * bets[betIndex].payout),
			updatedAt: Date.now(),
		};

		const updatedBets = [...bets];
		updatedBets[betIndex] = updatedBet;

		set({ bets: updatedBets });
		get().updateBudgetStatus(updatedBets);
	},

	// ====== BUDGET FUNCTIONS ======

	getRemainingBudget: (budgetCategory) => {
		const get = useBetStore.getState;
		const sharedCategories = {
			spreadOU: ["spread", "ou"],
			moneyLine: ["money_line"],
			prop: ["prop"],
		};

		const relevantCategories = sharedCategories[budgetCategory] || [];
		const totalUsed = get().bets.reduce((sum, bet) => {
			if (relevantCategories.includes(bet.category)) {
				return sum + bet.bet_amount;
			}
			return sum;
		}, 0);

		const maxBudget = DEFAULT_BUDGETS[budgetCategory] || 0;
		return maxBudget - totalUsed;
	},

	updateBudgetStatus: (bets) => {
		const calc = (categories, max) =>
			bets
				.filter((b) => categories.includes(b.category))
				.reduce((sum, b) => sum + b.bet_amount, 0) >= max;

		const spreadMaxed = calc(["spread", "ou"], DEFAULT_BUDGETS.spreadOU);
		const moneyLineMaxed = calc(["money_line"], DEFAULT_BUDGETS.moneyLine);
		const propMaxed = calc(["prop"], DEFAULT_BUDGETS.prop);

		set({
			budgetStatus: {
				spreadOU: spreadMaxed,
				moneyLine: moneyLineMaxed,
				prop: propMaxed,
			},
		});
	},

	getMaxPayout: () => {
		return get().bets.reduce((sum, bet) => sum + (bet.to_win_amount || 0), 0);
	},

	// ===== BETSLIP FUNCTIONS =====
	hasBetsInCategory: (categories) => {
		const relevant = Array.isArray(categories) ? categories : [categories];
		return get().bets.some((b) => relevant.includes(b.category));
	},

	// initial bet snapshot that is used for comparing betslips
	setInitialSnapshot: (snapshot) =>
		set({ initialBetsSnapshot: snapshot, betsToRemove: [] }),

	// make the backend bets compatible with what the front end expects
	transformBackendBets: (backendBets) =>
		backendBets.map((bet) => ({
			id: bet.id,
			bet_option_id: bet.bet_option_id,
			bet_amount: parseFloat(bet.bet_amount),
			to_win_amount: parseFloat(bet.to_win_amount),
			category: bet.bet_option.category,
			title: bet.bet_option.title,
			payout: bet.bet_option.payout,
			game: bet.bet_option.game,
			addedAt: new Date(bet.created_at).getTime(),
			isNew: false,
		})),

	// flag to check if there are unsaved bets
	hasUnsavedChanges: () => {
		const { bets, initialBetsSnapshot, betsToRemove } = get();

		// 1) If anything’s been marked for removal, we’re dirty
		if (betsToRemove.length > 0) return true;

		// 2) Otherwise compare the _essential_ fields of each bet
		const normalize = (arr) =>
			arr
				.map((b) => ({
					bet_option_id: b.bet_option_id,
					bet_amount: b.bet_amount,
				}))
				.sort((a, b) => a.bet_option_id - b.bet_option_id);

		return !isEqual(normalize(bets), normalize(initialBetsSnapshot));
	},

	// counter that is used to close the selectors on safe
	selectorsResetVersion: 0,
	resetSelectors: () =>
		set((s) => ({ selectorsResetVersion: s.selectorsResetVersion + 1 })),

	// ====== SAVE & LOAD BETS =====
	saveBets: async ({
		poolId,
		leagueSeasonId,
		battleId,
		betslipId,
		showError,
		showSuccess,
	}) => {
		try {
			// 1) Check locked
			const battleRes = await api.get(
				`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}`
			);
			if (battleRes.data.locked) {
				showError("Did not save: battle is locked.");
				return { status: "locked" };
			}

			// 2) Split new vs updated vs removed
			const { bets, betsToRemove } = get();
			const newBets = bets.filter((b) => b.isNew);
			const updatedBets = bets.filter(
				(b) => !b.isNew && !betsToRemove.includes(b.id)
			);

			// 3) Build payload
			const payload = {
				bets: {
					new_bets: newBets.map((b) => ({
						bet_option_id: b.bet_option_id,
						bet_amount: b.bet_amount,
					})),
					updated_bets: updatedBets.map((b) => ({
						id: b.id,
						bet_option_id: b.bet_option_id,
						bet_amount: b.bet_amount,
					})),
					removed_bets: betsToRemove,
				},
			};

			// 4) Send patches
			await api.patch(
				`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`,
				payload
			);
			await api.patch(
				`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}`,
				{ betslip: { status: "filled_out" } }
			);

			// 5) Re-fetch & normalize
			const res = await api.get(
				`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`
			);
			const normalized = get().transformBackendBets(res.data.bets);

			// 6) Persist locally & reset snapshots/removals
			await AsyncStorage.setItem(
				`bets-${battleId}`,
				JSON.stringify(normalized)
			);
			set({
				bets: normalized,
				initialBetsSnapshot: normalized,
				betsToRemove: [],
			});
			get().updateBudgetStatus(normalized);

			// 7) Recalc budgets
			// const budget = /* your calc logic */
			// updateBudgetForBattle(battleId, budget);

			showSuccess("Betslip saved.");
			return { status: "success" };
		} catch (err) {
			console.error("Error saving bets:", err.response || err);
			showError("Failed to save bets.");
			return { status: "error" };
		}
	},

	loadBets: async ({
		poolId,
		leagueSeasonId,
		battleId,
		betslipId,
		showError,
		forceBackend = false,
	}) => {
		try {
			// 0) clear in-memory state every time
			set({
				bets: [],
				betsToRemove: [],
				initialBetsSnapshot: [],
				budgetStatus: { spreadOU: false, moneyLine: false, prop: false },
			});

			// 1) Try AsyncStorage if not forcing backend
			if (!forceBackend) {
				const key = `bets-${battleId}`;
				const stored = await AsyncStorage.getItem(key);
				if (stored) {
					const parsed = JSON.parse(stored);
					set({
						bets: parsed,
						initialBetsSnapshot: parsed,
					});
					// recalc budgets (you’ll need to plug in your budget logic)
					// updateBudgetForBattle(battleId, /* your calc(parsed) */);
					get().updateBudgetStatus(parsed);
					return { status: "loaded-from-cache" };
				}
			}

			// 2) Fallback to network
			const url = `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`;
			const res = await api.get(url);
			const normalized = get().transformBackendBets(res.data.bets);

			// 3) Write to AsyncStorage for next time
			await AsyncStorage.setItem(
				`bets-${battleId}`,
				JSON.stringify(normalized)
			);

			// 4) Put into Zustand
			set({
				bets: normalized,
				initialBetsSnapshot: normalized,
				betsToRemove: [],
			});

			// 4b) **RECALCULATE** your budget flags for the new battle
			get().updateBudgetStatus(normalized);

			// 5) Recalc budgets
			// updateBudgetForBattle(battleId, /* your calc(normalized) */);

			return { status: "loaded-from-backend" };
		} catch (err) {
			console.error("Error in loadBets:", err);
			if (showError) showError("Failed to load bets.");
			return { status: "error", error: err };
		}
	},
}));
