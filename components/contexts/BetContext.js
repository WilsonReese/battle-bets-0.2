import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/axiosConfig";

const BetContext = createContext();

export const useBetContext = () => useContext(BetContext);

export const BetProvider = ({ children, battleId }) => {
	const [bets, setBets] = useState([]);
	const [spreadOUBudget, setSpreadOUBudget] = useState(2000); // Initial budget for spread and OU
	const [moneyLineBudget, setMoneyLineBudget] = useState(1000); // Initial budget for money line
	const [propBetBudget, setPropBetBudget] = useState(500); // Initial budget for prop bets
	const [totalSpreadOUBet, setTotalSpreadOUBet] = useState(0);
	const [totalMoneyLineBet, setTotalMoneyLineBet] = useState(0);
	const [totalPropBet, setTotalPropBet] = useState(0);
	const [betOptionType, setBetOptionType] = useState("spreadOU"); // sets SpreadOU as initial bet option type state
	const [betsToRemove, setBetsToRemove] = useState([]); // State for tracking bets to remove
	const [initialBetsSnapshot, setInitialBetsSnapshot] = useState([]);
	const [budgetsByBattle, setBudgetsByBattle] = useState({});
	const [openBetSelectorIds, setOpenBetSelectorIds] = useState(new Set());

	const closeAllBetSelectors = () => setOpenBetSelectorIds(new Set());

	const toggleBetSelector = (betId) => {
		setOpenBetSelectorIds((prev) => {
			const next = new Set(prev);
			if (next.has(betId)) {
				next.delete(betId);
			} else {
				next.add(betId);
			}
			return next;
		});
	};

	const loadBets = async (
		poolId,
		leagueSeasonId,
		battleId,
		betslipId,
		forceBackend = false
	) => {
		try {
			if (!forceBackend) {
				const storedBets = await AsyncStorage.getItem(`bets-${battleId}`);
				if (storedBets) {
					const parsedBets = JSON.parse(storedBets);
					setBets(parsedBets);
					setInitialBetsSnapshot(parsedBets);
					recalculateTotals(parsedBets);
					return;
				}
			}

			// If forceBackend OR no stored bets
			const response = await api.get(
				`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`
			);

			const { bets, status } = response.data;

			const transformedBets = transformBackendBets(bets);

			await AsyncStorage.setItem(
				`bets-${battleId}`,
				JSON.stringify(transformedBets)
			);
			setBets(transformedBets);
			setInitialBetsSnapshot(transformedBets);
			recalculateTotals(transformedBets);
			const calculatedBudget = calculateRemainingBudget(transformedBets);
			setBudgetsByBattle((prev) => ({
				...prev,
				[battleId]: calculatedBudget,
			}));
		} catch (error) {
			console.error("Error loading bets from backend:", error);
		}
	};

	const transformBackendBets = (bets) => {
		return bets.map((bet) => ({
			id: bet.id,
			name: bet.bet_option.long_title,
			betAmount: parseFloat(bet.bet_amount),
			toWinAmount: parseFloat(bet.to_win_amount),
			betType: convertToCamelCase(bet.bet_option.category),
			betOptionID: bet.bet_option_id,
			shortTitle: bet.bet_option.title,
			payout: bet.bet_option.payout,
			game: bet.bet_option.game,
			betslip: bet.betslip,
			addedAt: new Date(bet.created_at).getTime() || Date.now() + index,
		}));
	};

	// Store bets in AsyncStorage

	const storeBets = async (battleId, betsToStore) => {
		try {
			if (betsToStore.length > 0) {
				await AsyncStorage.setItem(
					`bets-${battleId}`,
					JSON.stringify(betsToStore)
				);
			} else {
				await AsyncStorage.removeItem(`bets-${battleId}`);
			}
		} catch (error) {
			console.error("Failed to store bets:", error);
		}
	};

	const convertToCamelCase = (betType) => {
		const betTypeCamelCase = {
			spread: "spread",
			ou: "overUnder",
			money_line: "moneyLine",
			prop: "prop",
		};
		return betTypeCamelCase[betType] || "spreadOU"; // Default to "spreadOU" if not found
	};

	const updateTotalBetState = (betOptionType, amount, operation) => {
		const stateSetters = {
			spreadOU: setTotalSpreadOUBet,
			moneyLine: setTotalMoneyLineBet,
			prop: setTotalPropBet,
		};
		const setter = stateSetters[betOptionType];

		if (setter) {
			setter((prevTotal) => {
				switch (operation) {
					case "add":
						return prevTotal + amount;
					case "remove":
						return prevTotal - amount;
					case "update":
						return prevTotal + amount; // Assuming update means incrementing by the amount
					default:
						return prevTotal;
				}
			});
		}
	};

	const recalculateTotals = (bets) => {
		// Helper function to recalculate totals when loading from storage
		let totalSpreadOUBet = 0;
		let totalMoneyLineBet = 0;
		let totalPropBet = 0;

		bets.forEach((bet) => {
			const betOptionType = getBetOptionType(bet.betType);
			switch (betOptionType) {
				case "spreadOU":
					totalSpreadOUBet += bet.betAmount;
					break;
				case "moneyLine":
					totalMoneyLineBet += bet.betAmount;
					break;
				case "prop":
					totalPropBet += bet.betAmount;
					break;
				default:
					break;
			}
		});

		setTotalSpreadOUBet(totalSpreadOUBet);
		setTotalMoneyLineBet(totalMoneyLineBet);
		setTotalPropBet(totalPropBet);
	};

	const addBet = ({
		title,
		betAmount,
		payout,
		betType,
		betOptionID,
		shortTitle,
		game,
	}) => {
		const newBet = {
			id: uuid.v4(),
			name: title,
			betAmount,
			toWinAmount: Math.round(betAmount * payout),
			betType: betType,
			betOptionID: betOptionID,
			isNew: true, // Flag to indicate it's a new bet
			shortTitle: shortTitle,
			payout: payout,
			game: game,
			addedAt: Date.now(), // Track when the bet was added
		};
		setBets((prevBets) => [...prevBets, newBet]);
		updateTotalBetState(getBetOptionType(betType), betAmount, "add");
		return newBet;
	};

	const removeBet = (id) => {
		const betToRemove = bets.find((bet) => bet.id === id);
		if (betToRemove) {
			// Add the removed bet to betsToRemove only if it exists in the backend
			if (!betToRemove.isNew) {
				setBetsToRemove((prev) => [...prev, betToRemove.id]);
			}
			setBets((prevBets) => prevBets.filter((bet) => bet.id !== id));
			updateTotalBetState(
				getBetOptionType(betToRemove.betType),
				betToRemove.betAmount,
				"remove"
			);
		}
	};

	const updateBet = (id, newBetAmount, payout) => {
		const previousBet = bets.find((bet) => bet.id === id);
		const previousBetAmount = previousBet ? previousBet.betAmount : 0;

		const updatedBets = bets.map((bet) =>
			bet.id === id
				? {
						...bet,
						betAmount: newBetAmount,
						toWinAmount: newBetAmount * payout,
				  }
				: bet
		);

		setBets(updatedBets);
		updateTotalBetState(
			getBetOptionType(previousBet.betType),
			newBetAmount - previousBetAmount,
			"update"
		);
	};

	const getBetOptionType = (betType) => {
		const betTypeToOptionType = {
			spread: "spreadOU",
			ou: "spreadOU",
			moneyLine: "moneyLine",
			prop: "prop",
		};
		return betTypeToOptionType[betType] || "spreadOU"; // Default to "spreadOU" if not found
	};

	const getBudget = (betOptionType) => {
		const budgetByBetOptionType = {
			spreadOU: spreadOUBudget,
			moneyLine: moneyLineBudget,
			prop: propBetBudget,
		};
		return budgetByBetOptionType[betOptionType];
	};

	const getTotalBetAmount = (betOptionType) => {
		const totalBetAmountByBetOptionType = {
			spreadOU: totalSpreadOUBet,
			moneyLine: totalMoneyLineBet,
			prop: totalPropBet,
		};
		return totalBetAmountByBetOptionType[betOptionType] || 0;
	};

	const getBetOptionLongTitle = (betOptionType) => {
		const betOptionLongTitleByType = {
			spreadOU: "Spread and Over/Under",
			moneyLine: "Money Line",
			prop: "Prop Bets",
		};
		return betOptionLongTitleByType[betOptionType];
	};

	const areAllBetsComplete = () => {
		return (
			totalSpreadOUBet === spreadOUBudget &&
			totalMoneyLineBet === moneyLineBudget &&
			totalPropBet === propBetBudget
		);
	};

	const getTotalRemainingBudget = () => {
		return {
			spreadOU: spreadOUBudget - totalSpreadOUBet,
			moneyLine: moneyLineBudget - totalMoneyLineBet,
			prop: propBetBudget - totalPropBet,
		};
	};

	const calculateRemainingBudget = (bets) => {
		let spreadOU = 0;
		let moneyLine = 0;
		let prop = 0;

		bets.forEach((bet) => {
			const type = getBetOptionType(bet.betType);
			switch (type) {
				case "spreadOU":
					spreadOU += bet.betAmount;
					break;
				case "moneyLine":
					moneyLine += bet.betAmount;
					break;
				case "prop":
					prop += bet.betAmount;
					break;
			}
		});

		return {
			spreadOU: spreadOUBudget - spreadOU,
			moneyLine: moneyLineBudget - moneyLine,
			prop: propBetBudget - prop,
		};
	};

	const getBudgetForBattle = (battleId) => {
		return (
			budgetsByBattle[battleId] || {
				spreadOU: spreadOUBudget,
				moneyLine: moneyLineBudget,
				prop: propBetBudget,
			}
		);
	};

	// const getUserBetsByGame = async (gameId) => {
	// 	try {
	// 		const response = await api.get(`/games/${gameId}/my_bets`);
	// 		const rawBets = response.data;

	// 		const transformedBets = transformBackendBets(rawBets);

	// 		return transformedBets;
	// 	} catch (error) {
	// 		console.error("Error fetching user bets by game:", error);
	// 		return [];
	// 	}
	// };

	// const getUserBetsByGame = async (gameId) => {
	// 	try {
	// 		const response = await api.get(`/games/${gameId}/my_bets`);
	// 		return response.data; // raw backend data, including betslip, pool, etc.
	// 	} catch (error) {
	// 		console.error("Error fetching user bets by game:", error);
	// 		return [];
	// 	}
	// };

	const getUserBetsByGame = useCallback(
		async (gameId) => {
		try {
			const { data } = await api.get(`/games/${gameId}/my_bets`);
			// data = { bets: [...], pool_count: N }
			return {
				bets: data.bets,
				poolCount: data.pool_count
			};
		} catch (error) {
			console.error("Error fetching user bets by game:", error);
			return { bets: [], poolCount: 0 };
		} 
	}, [])

	return (
		<BetContext.Provider
			value={{
				bets,
				setBets,
				addBet,
				removeBet,
				updateBet,
				betsToRemove,
				setBetsToRemove,
				spreadOUBudget,
				setSpreadOUBudget,
				totalSpreadOUBet,
				moneyLineBudget,
				setMoneyLineBudget,
				totalMoneyLineBet,
				propBetBudget,
				setPropBetBudget,
				totalPropBet,
				betOptionType,
				setBetOptionType,
				getBetOptionType,
				getBudget,
				getTotalBetAmount,
				getBetOptionLongTitle,
				areAllBetsComplete,
				loadBets,
				// loadStoredBets,
				storeBets,
				// loadBetsFromBackend,
				// submitBets,
				getTotalRemainingBudget,

				// New 5.27.2025
				initialBetsSnapshot,
				setInitialBetsSnapshot,
				convertToCamelCase,
				transformBackendBets,
				getBudgetForBattle,
				openBetSelectorIds,
				closeAllBetSelectors,
				toggleBetSelector,

				// New 6.18.2025
				getUserBetsByGame,
			}}
		>
			{children}
		</BetContext.Provider>
	);
};
