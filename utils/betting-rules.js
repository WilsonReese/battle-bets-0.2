export const BETTING_RULES = {
	spread: {
		minBet: 100,
		maxBet: 1000,
	},
	ou: {
		minBet: 100,
		maxBet: 1000,
	},
	money_line: {
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

export const categoryToBudgetKey = (category) => {
  switch (category) {
    case "spread":
    case "ou":
      return "spreadOU";
    case "money_line":
      return "moneyLine";
    case "prop":
      return "prop";
    default:
      return null;
  }
};
