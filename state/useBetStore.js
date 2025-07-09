import { create } from "zustand";
import { DEFAULT_BUDGETS } from "../utils/betting-rules";

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

	// ===== Add, Remove, Update Bets ====

	addBet: (newBet) => {
		const filtered = get().bets.filter(
			(b) => b.bet_option_id !== newBet.bet_option_id
		);
		const updatedBets = [...filtered, { ...newBet, addedAt: Date.now() }];

		set({ bets: updatedBets });

		get().updateBudgetStatus(updatedBets); // ← recalculate budgets after adding
	},

	removeBet: (betOptionId) => {
		const updatedBets = get().bets.filter(
			(b) => b.bet_option_id !== betOptionId
		);
		set({ bets: updatedBets });

		get().updateBudgetStatus(updatedBets);
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

	// getBetsByCategory: (category) => {
	// 	const shared = {
	// 		spread: ["spread", "ou"],
	// 		ou: ["spread", "ou"],
	// 		money_line: ["money_line"],
	// 		prop: ["prop"],
	// 	};
	// 	const relevant = shared[category] || [];
	// 	return get().bets.filter((b) => relevant.includes(b.category));
	// },

	// getTotalForCategory: (category) => {
	// 	return get()
	// 		.getBetsByCategory(category)
	// 		.reduce((sum, b) => sum + b.bet_amount, 0);
	// },

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
}));
