import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/axiosConfig";
import { BudgetContext, useBudgets } from "./BudgetContext";

const BetStateContext = createContext();
const BetActionsContext = createContext();

export const useBets = () => useContext(BetStateContext);
export const useBetOps = () => useContext(BetActionsContext);

export const BetProvider = ({ children }) => {
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
	// const [budgetsByBattle, setBudgetsByBattle] = useState({});
	const [openBetSelectorIds, setOpenBetSelectorIds] = useState(new Set());
	const { updateBudgetForBattle } = useBudgets();

	// Memoized
	const closeAllBetSelectors = useCallback(() => {
		setOpenBetSelectorIds(new Set());
	}, []);

	// Memoized
	const toggleBetSelector = useCallback((betId) => {
		setOpenBetSelectorIds((prev) => {
			const next = new Set(prev);
			next.has(betId) ? next.delete(betId) : next.add(betId);
			return next;
		});
	}, []);

	// Memoized
	const loadBets = useCallback(
		async (
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

				const response = await api.get(
					`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`
				);

				const { bets } = response.data;
				const transformedBets = transformBackendBets(bets);

				await AsyncStorage.setItem(
					`bets-${battleId}`,
					JSON.stringify(transformedBets)
				);

				setBets(transformedBets);
				setInitialBetsSnapshot(transformedBets);
				recalculateTotals(transformedBets);
				const calculatedBudget = calculateRemainingBudget(transformedBets);
				updateBudgetForBattle(battleId, calculatedBudget);
			} catch (error) {
				console.error("Error loading bets from backend:", error);
			}
		},
		[
			setBets,
			setInitialBetsSnapshot,
			recalculateTotals,
			transformBackendBets,
			calculateRemainingBudget,
			// setBudgetsByBattle,
		]
	);

	// Memoized
	const transformBackendBets = useCallback(
		(bets) => {
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
				addedAt: new Date(bet.created_at).getTime() || Date.now(),
			}));
		},
		[convertToCamelCase]
	);

	// Memoized
	// Store bets in AsyncStorage
	const storeBets = useCallback(async (battleId, betsToStore) => {
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
	}, []);

	// Memoized
	const convertToCamelCase = useCallback((betType) => {
		const betTypeCamelCase = {
			spread: "spread",
			ou: "overUnder",
			money_line: "moneyLine",
			prop: "prop",
		};
		return betTypeCamelCase[betType] || "spreadOU";
	}, []);

	// Didn't need to memoize
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

	// Memoized
	const recalculateTotals = useCallback(
		(bets) => {
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
		},
		[getBetOptionType]
	);

	// Memoized
	const addBet = useCallback(
		({ title, betAmount, payout, betType, betOptionID, shortTitle, game }) => {
			const newBet = {
				id: uuid.v4(),
				name: title,
				betAmount,
				toWinAmount: Math.round(betAmount * payout),
				betType,
				betOptionID,
				isNew: true,
				shortTitle,
				payout,
				game,
				addedAt: Date.now(),
			};

			setBets((prevBets) => [...prevBets, newBet]);
			updateTotalBetState(getBetOptionType(betType), betAmount, "add");
			return newBet;
		},
		[setBets, updateTotalBetState, getBetOptionType]
	);

	// Memoized
	const removeBet = useCallback(
		(id) => {
			const betToRemove = bets.find((bet) => bet.id === id);
			if (betToRemove) {
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
		},
		[bets, setBetsToRemove, setBets, updateTotalBetState, getBetOptionType]
	);

	// Memoized
	const updateBet = useCallback(
		(id, newBetAmount, payout) => {
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

			if (previousBet) {
				updateTotalBetState(
					getBetOptionType(previousBet.betType),
					newBetAmount - previousBetAmount,
					"update"
				);
			}
		},
		[bets, setBets, updateTotalBetState, getBetOptionType]
	);

	// Memoized
	const getBetOptionType = useCallback((betType) => {
		const betTypeToOptionType = {
			spread: "spreadOU",
			ou: "spreadOU",
			moneyLine: "moneyLine",
			prop: "prop",
		};
		return betTypeToOptionType[betType] || "spreadOU"; // Default to "spreadOU" if not found
	}, []);

	// Memoized
	const getBudget = useCallback(
		(betOptionType) => {
			const budgetByBetOptionType = {
				spreadOU: spreadOUBudget,
				moneyLine: moneyLineBudget,
				prop: propBetBudget,
			};
			return budgetByBetOptionType[betOptionType];
		},
		[spreadOUBudget, moneyLineBudget, propBetBudget]
	);

	// Memoized
	const getTotalBetAmount = useCallback(
		(betOptionType) => {
			const totalBetAmountByBetOptionType = {
				spreadOU: totalSpreadOUBet,
				moneyLine: totalMoneyLineBet,
				prop: totalPropBet,
			};
			return totalBetAmountByBetOptionType[betOptionType] || 0;
		},
		[totalSpreadOUBet, totalMoneyLineBet, totalPropBet]
	);

	// Memoized
	const getBetOptionLongTitle = useCallback((betOptionType) => {
		const betOptionLongTitleByType = {
			spreadOU: "Spread and Over/Under",
			moneyLine: "Money Line",
			prop: "Prop Bets",
		};
		return betOptionLongTitleByType[betOptionType];
	}, []);

	// Memoized
	const getTotalRemainingBudget = useCallback(() => {
		return {
			spreadOU: spreadOUBudget - totalSpreadOUBet,
			moneyLine: moneyLineBudget - totalMoneyLineBet,
			prop: propBetBudget - totalPropBet,
		};
	}, [
		spreadOUBudget,
		totalSpreadOUBet,
		moneyLineBudget,
		totalMoneyLineBet,
		propBetBudget,
		totalPropBet,
	]);

	// Memoized
	const calculateRemainingBudget = useCallback(
		(bets) => {
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
		},
		[getBetOptionType, spreadOUBudget, moneyLineBudget, propBetBudget]
	);

	const getUserBetsByGame = useCallback(async (gameId) => {
		try {
			const { data } = await api.get(`/games/${gameId}/my_bets`);
			// data = { bets: [...], pool_count: N }
			return {
				bets: data.bets,
				poolCount: data.pool_count,
			};
		} catch (error) {
			console.error("Error fetching user bets by game:", error);
			return { bets: [], poolCount: 0 };
		}
	}, []);

	const saveBets = useCallback(
		async ({
			poolId,
			leagueSeasonId,
			battleId,
			betslipId,
			showError,
			showSuccess,
		}) => {
			try {
				const battleRes = await api.get(
					`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}`
				);
				if (battleRes.data.locked) {
					showError("Did not save the updated betslip. Battle is locked.");
					return { status: "locked" };
				}

				const newBets = bets.filter((bet) => bet.isNew);
				const updatedBets = bets.filter(
					(bet) => !bet.isNew && !betsToRemove.includes(bet.id)
				);
				const removedBets = betsToRemove;

				const payload = {
					bets: {
						new_bets: newBets.map(({ betOptionID, betAmount }) => ({
							bet_option_id: betOptionID,
							bet_amount: betAmount,
						})),
						updated_bets: updatedBets.map(({ id, betOptionID, betAmount }) => ({
							id,
							bet_option_id: betOptionID,
							bet_amount: betAmount,
						})),
						removed_bets: removedBets,
					},
				};

				await api.patch(
					`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`,
					payload
				);
				await api.patch(
					`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}`,
					{
						betslip: { status: "filled_out" },
					}
				);

				const res = await api.get(
					`/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`
				);
				const normalized = transformBackendBets(res.data.bets);

				await AsyncStorage.setItem(
					`bets-${battleId}`,
					JSON.stringify(normalized)
				);
				setBets(normalized);
				setInitialBetsSnapshot(normalized);
				setBetsToRemove([]);

				const calculatedBudget = calculateRemainingBudget(normalized);
				updateBudgetForBattle(battleId, calculatedBudget);

				showSuccess("Betslip saved.");
				return { status: "success" };
			} catch (error) {
				console.error("Error saving bets:", error.response || error);
				showError("Failed to save bets.");
				return { status: "error" };
			}
		},
		[
			bets,
			betsToRemove,
			transformBackendBets,
			setBets,
			setInitialBetsSnapshot,
			setBetsToRemove,
			calculateRemainingBudget,
			updateBudgetForBattle, // 👈 must include in deps
		]
	);

	const stateValue = useMemo(
		() => ({
			bets, //
			betsToRemove, //  Betslip Heading
			initialBetsSnapshot, //  Betslip Heading
			spreadOUBudget, // Betslip Details
			// totalSpreadOUBet,
			moneyLineBudget, // Betslip Details
			// totalMoneyLineBet,
			propBetBudget, // Betslip Details
			// totalPropBet,
			betOptionType, //

			// Battle Unlocked Pool Card
			// getTotalRemainingBudget,
			/* anything read-only */

			openBetSelectorIds,
		}),
		[
			bets,
			betsToRemove, //  Betslip Heading
			initialBetsSnapshot, //  Betslip Heading
			spreadOUBudget,
			// totalSpreadOUBet,
			moneyLineBudget,
			// totalMoneyLineBet,
			propBetBudget,
			// totalPropBet,
			betOptionType,
			// budgetsByBattle,
			openBetSelectorIds,
		]
	);

	const actionsValue = useMemo(
		() => ({
			addBet,
			removeBet,
			updateBet,
			loadBets,
			storeBets,
			toggleBetSelector, // can stay here
			closeAllBetSelectors,
			getUserBetsByGame, // ✅ add this here
			getBudget,
			getTotalBetAmount,

			getBetOptionLongTitle,
			// getTotalRemainingBudget,
			getBetOptionType,
			saveBets, //  Betslip Heading
			// setBetsToRemove, //  Betslip Heading
			// setInitialBetsSnapshot, //  Betslip Heading
			setBetOptionType, // Progress Indicator
		}),
		[
			addBet,
			removeBet,
			updateBet,
			loadBets,
			storeBets,
			toggleBetSelector,
			closeAllBetSelectors,
			getUserBetsByGame, // ✅ and in dependencies
			saveBets, //  Betslip Heading
			// setBetsToRemove, //  Betslip Heading
			// setInitialBetsSnapshot, //  Betslip Heading
			setBetOptionType, // Progress Indicator
		]
	);

	return (
		<BetStateContext.Provider value={stateValue}>
			<BetActionsContext.Provider value={actionsValue}>
				{children}
			</BetActionsContext.Provider>
		</BetStateContext.Provider>
	);
};