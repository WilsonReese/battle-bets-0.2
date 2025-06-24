export const BETTING_RULES = {
	spread: {
		minBet: 100,
		maxBet: 1000,
	},
	overUnder: {
		minBet: 100,
		maxBet: 1000,
	},
	moneyLine: {
		minBet: 100,
		maxBet: 500,
	},
	prop: {
		minBet: 100,
		maxBet: 500,
	},
	// Add other bet types here
};

export const DEFAULT_BUDGETS = {
  // combine spread + OU into one pool for the UI
  spreadOU:  2000,
  moneyLine: 1000,
  prop:      500
};
