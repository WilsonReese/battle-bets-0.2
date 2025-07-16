import React, {
	createContext,
	useContext,
	useState,
	useMemo,
	useCallback,
	useEffect,
} from "react";
import { DEFAULT_BUDGETS } from "../../utils/betting-rules";
import { registerAddBet } from "../../utils/betDispatcher";

const BetSelectionContext = createContext();

export const BetSelectionProvider = ({ betslipId, children }) => {
	const [localBets, setLocalBets] = useState([]);
	const [budgetStatus, setBudgetStatus] = useState({
		spreadOU: false, // false means NOT maxed out
		moneyLine: false,
		prop: false,
	});

	// Add a new bet (replaces any existing bet for the same bet_option_id)
	const addBet = useCallback((bet) => {
		const { bet_option_id } = bet;

		setLocalBets((prev) => {
			const filtered = prev.filter((b) => b.bet_option_id !== bet_option_id);
			return [...filtered, { ...bet, addedAt: Date.now() }];
		});
		// console.log('Local Bets', localBets)
	}, []);

	// print local bets whenever they are updated
	useEffect(() => {
		console.log("✅ Local Bets Updated:", localBets);
	}, [localBets]);

	// This calls the betDispatcher.js file and adds the bet, but I don't have to call addBet in the component
	useEffect(() => {
		registerAddBet(addBet);
	}, [addBet]);

	// Remove a bet by bet_option_id
	const removeBet = useCallback((bet_option_id) => {
		setLocalBets((prev) =>
			prev.filter((b) => b.bet_option_id !== bet_option_id)
		);
	}, []);

	useEffect(() => {
		const spreadTotal = getTotalForCategory("spread");
		const spreadMaxed = spreadTotal >= DEFAULT_BUDGETS.spreadOU;

		const moneyLineTotal = getTotalForCategory("money_line");
		const moneyLineMaxed = moneyLineTotal >= DEFAULT_BUDGETS.moneyLine;

		const propTotal = getTotalForCategory("prop");
		const propMaxed = propTotal >= DEFAULT_BUDGETS.prop;

		setBudgetStatus({
			spreadOU: spreadMaxed,
			moneyLine: moneyLineMaxed,
			prop: propMaxed,
		});
	}, [localBets]);

	// Get a bet by bet_option_id (returns undefined if not found)
	const getBetByOptionId = useCallback(
		(bet_option_id) => localBets.find((b) => b.bet_option_id === bet_option_id),
		[localBets]
	);

	// Sum of bet_amounts for a category (e.g., "spread")
	const getTotalForCategory = useCallback(
		(category) => {
			const sharedCategories = {
				spread: ["spread", "ou"],
				ou: ["spread", "ou"],
				money_line: ["money_line"],
				prop: ["prop"],
			};

			const relevantCategories = sharedCategories[category] || [];

			return localBets.reduce((sum, bet) => {
				if (relevantCategories.includes(bet.category)) {
					return sum + bet.bet_amount;
				}
				return sum;
			}, 0);
		},
		[localBets]
	);

	const value = useMemo(
		() => ({
			localBets,
			addBet,
			removeBet,
			getBetByOptionId,
			getTotalForCategory,
      budgetStatus
		}),
		[localBets, addBet, removeBet, getBetByOptionId, getTotalForCategory, budgetStatus]
	);

	return (
		<BetSelectionContext.Provider value={value}>
			{children}
		</BetSelectionContext.Provider>
	);
};

export const useBetSelection = () => useContext(BetSelectionContext);
