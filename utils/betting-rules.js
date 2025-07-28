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
	spreadOU: 2000,
	moneyLine: 1000,
	prop: 500,
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

export function getSeasonScoringRules(leagueSize) {
	if (leagueSize <= 7) {
		return [
			{ position: "1st", points: 50 },
			{ position: "2nd", points: 35 },
			{ position: "3rd", points: 25 },
		];
	}
	if (leagueSize <= 11) {
		return [
			{ position: "1st", points: 50 },
			{ position: "2nd", points: 35 },
			{ position: "3rd", points: 25 },
			{ position: "Top 50%", points: 10 },
		];
	}
	if (leagueSize <= 17) {
		return [
			{ position: "1st", points: 50 },
			{ position: "2nd", points: 35 },
			{ position: "Top 25%", points: 25 },
			{ position: "Top 50%", points: 10 },
		];
	}
	if (leagueSize <= 25) {
		return [
			{ position: "1st", points: 50 },
			{ position: "2nd & 3rd", points: 35 },
			{ position: "4th & 5th", points: 25 },
			{ position: "Top 50%", points: 10 },
		];
	}
	if (leagueSize <= 39) {
		return [
			{ position: "1st", points: 50 },
			{ position: "2nd & 3rd", points: 35 },
			{ position: "Top 25%", points: 25 },
			{ position: "Top 50%", points: 10 },
		];
	}
	// 40+
	return [
		{ position: "1st", points: 50 },
		{ position: "Top 10%", points: 35 },
		{ position: "Top 25%", points: 25 },
		{ position: "Top 50%", points: 10 },
	];
}

export function getPlayoffRules(n) {
  let confirmed, playIn, advance, total;

  if (n <= 5) {
    // 1–5: hand‑tuned
    // 1 ⇒ 1 locked, 0 play‑in
    // 2 ⇒ 2 locked, 0 play‑in
    // 3,4,5 ⇒ 2 locked, 0 play‑in
    confirmed    = n <= 2 ? n : 2;
    playIn    = 0;
    advance   = 0;
		total = locked + advance
  } else {
    // 6+ : 
    //  • locked = floor(40% of n)
    //  • play‑in = round(60% of n) − locked
    //  • advance = floor(50% of n) − locked
    confirmed    = Math.floor(n * 0.4);
    const top60 = Math.round(n * 0.6);
    playIn    = Math.max(0, top60 - confirmed);
    advance   = Math.max(0, Math.floor(n * 0.5) - confirmed);
		total = confirmed + advance
  }

  return { confirmed, playIn, advance, total };
}
