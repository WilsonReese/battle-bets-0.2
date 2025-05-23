import React, { createContext, useState, useContext, useEffect } from "react";
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

  const loadBets = async (poolId, leagueSeasonId, battleId, betslipId) => {
    try {
      // Step 1: Check AsyncStorage for existing bets
      const storedBets = await AsyncStorage.getItem(`bets-${battleId}`);
      if (storedBets) {
        const parsedBets = JSON.parse(storedBets);
        console.log("Loaded bets from storage:", parsedBets);
        setBets(parsedBets);
        recalculateTotals(parsedBets);
        return; // Exit early since bets were loaded from storage
      }

      // Step 2: If no stored bets, fetch from backend
      const response = await api.get(
        `/pools/${poolId}/league_seasons/${leagueSeasonId}/battles/${battleId}/betslips/${betslipId}/bets`
      );

      const { bets, status } = response.data;

      if (status === "submitted") {
        const transformedBets = bets.map((bet) => ({
          id: bet.id,
          name: bet.bet_option.long_title,
          betAmount: parseFloat(bet.bet_amount),
          toWinAmount: parseFloat(bet.to_win_amount),
          betType: convertToCamelCase(bet.bet_option.category),
          betOptionID: bet.bet_option_id,
          shortTitle: bet.bet_option.title,
          payout: bet.bet_option.payout,
          game: bet.bet_option.game,
        }));

        // console.log("Transformed Bets from Backend:", transformedBets);

        // Store the bets in AsyncStorage
        await AsyncStorage.setItem(
          `bets-${battleId}`,
          JSON.stringify(transformedBets)
        );

        // Update state with the transformed bets
        setBets(transformedBets);
        recalculateTotals(transformedBets);
      } else {
        console.log(
          `Betslip for battle ${battleId} not submitted. No bets loaded.`
        );
      }
    } catch (error) {
      console.error("Error loading bets:", error);
    }
  };

  // Store bets in AsyncStorage

  const storeBets = async (battleId, betsToStore) => {
    try {
      if (betsToStore.length > 0) {
        await AsyncStorage.setItem(
          `bets-${battleId}`,
          JSON.stringify(betsToStore)
        );
        // console.log(`Stored Bets for battle ${battleId}`);
      } else {
        await AsyncStorage.removeItem(`bets-${battleId}`);
        // console.log(`Cleared Bets for battle ${battleId}`);
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
    };
    console.log("Bet Context, New Bet:", newBet);
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
      console.log("Removed Bet:", betToRemove);
      setBets((prevBets) => prevBets.filter((bet) => bet.id !== id));
      updateTotalBetState(
        getBetOptionType(betToRemove.betType),
        betToRemove.betAmount,
        "remove"
      );
    }
    // console.log('Bet removed:', betToRemove)
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
      }}
    >
      {children}
    </BetContext.Provider>
  );
};
