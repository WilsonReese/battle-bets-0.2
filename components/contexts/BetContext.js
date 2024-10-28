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

  // Fetch bets from the backend if the betslip status is 'submitted'
  // const loadBetsFromBackend = async (poolId, battleId, betslipId) => {
  //   try {
  //     const response = await api.get(
  //       `/pools/${poolId}/battles/${battleId}/betslips/${betslipId}/bets`
  //     );

  //     const { bets, status } = response.data;

  //     const transformedBets = bets.map((bet) => ({
  //       id: bet.id, // Use the ID from the backend
  //       name: bet.bet_option.title, // Use the title from bet_option
  //       betAmount: parseFloat(bet.bet_amount),
  //       toWinAmount: parseFloat(bet.to_win_amount),
  //       betType: bet.bet_option.category, // Use the category from bet_option
  //       betOptionID: bet.bet_option_id, // Match the frontend structure
  //     }));

  //     console.log("Transformed Bets:", transformedBets);
  //     // Store bets in AsyncStorage if the betslip is submitted
  //     if (status === "submitted") {
  //       await AsyncStorage.setItem(
  //         `bets-${battleId}`,
  //         JSON.stringify(transformedBets)
  //       );
  //     }

  //     setBets(transformedBets); // Update state with transformed bets
  //     recalculateTotals(transformedBets);
  //   } catch (error) {
  //     console.error(
  //       "Error loading bets from backend:",
  //       error.response || error
  //     );
  //   }
  // };

  // // I need to use a UseEffect to load the bets from the backend
  // // Load bets from AsyncStorage
  // const loadStoredBets = async (battleId) => {
  //   try {
  //     const storedBets = await AsyncStorage.getItem(`bets-${battleId}`);
  //     console.log("Stored Bets:", `bets-${battleId}`, storedBets);
  //     if (storedBets) {
  //       const parsedBets = JSON.parse(storedBets);
  //       setBets(parsedBets);
  //       console.log("Loaded bets from storage:", parsedBets);
  //       // Optionally recalculate total bet amounts if needed
  //       recalculateTotals(parsedBets);
  //     } else {
  //       console.log(`No stored bets for battle ${battleId}`);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load stored bets:", error);
  //   }
  // };

  const loadBets = async (poolId, battleId, betslipId) => {
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
        `/pools/${poolId}/battles/${battleId}/betslips/${betslipId}/bets`
      );
  
      const { bets, status } = response.data;
  
      if (status === "submitted") {
        const transformedBets = bets.map((bet) => ({
          id: bet.id,
          name: bet.bet_option.title,
          betAmount: parseFloat(bet.bet_amount),
          toWinAmount: parseFloat(bet.to_win_amount),
          betType: convertToCamelCase(bet.bet_option.category),
          betOptionID: bet.bet_option_id,
        }));
  
        console.log("Transformed Bets from Backend:", transformedBets);
  
        // Store the bets in AsyncStorage
        await AsyncStorage.setItem(
          `bets-${battleId}`,
          JSON.stringify(transformedBets)
        );
  
        // Update state with the transformed bets
        setBets(transformedBets);
        recalculateTotals(transformedBets);
      } else {
        console.log(`Betslip for battle ${battleId} not submitted. No bets loaded.`);
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

  const addBet = ({ title, betAmount, payout, betType, betOptionID }) => {
    const newBet = {
      id: uuid.v4(),
      name: title,
      betAmount,
      toWinAmount: betAmount * payout,
      betType: betType,
      betOptionID: betOptionID,
    };
    console.log("Bet Context, New Bet:", newBet);
    setBets((prevBets) => [...prevBets, newBet]);
    updateTotalBetState(getBetOptionType(betType), betAmount, "add");
    return newBet;
  };

  const removeBet = (id) => {
    const betToRemove = bets.find((bet) => bet.id === id);
    if (betToRemove) {
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

  // const submitBets = async () => {
  //   try {
  //     // Make the API call to submit the bets
  //     await api.post('/bets', { bets });
  //     // Clear bets after successful submission
  //     setBets([]);
  //     await AsyncStorage.removeItem('bets');
  //   } catch (error) {
  //     console.error("Failed to submit bets:", error);
  //   }
  // };

  return (
    <BetContext.Provider
      value={{
        bets,
        addBet,
        removeBet,
        updateBet,
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
        setBets,
        // submitBets,
      }}
    >
      {children}
    </BetContext.Provider>
  );
};

// // Fetch bets from the backend if the betslip status is 'submitted'
// const loadBetsFromBackend = async () => {
//   try {
//     const response = await api.get(
//       `/pools/${poolId}/battles/${battleId}/betslips/${betslipId}/bets`
//     );

//     const transformedBets = response.data.map((bet) => ({
//       id: bet.id, // Use the ID from the backend
//       name: bet.bet_option.title, // Use the title from bet_option
//       betAmount: parseFloat(bet.bet_amount),
//       toWinAmount: parseFloat(bet.to_win_amount),
//       betType: bet.bet_option.category, // Use the category from bet_option
//       betOptionID: bet.bet_option_id, // Match the frontend structure
//     }));

//     console.log("Transformed Bets:", transformedBets);
//     setBets(transformedBets); // Update state with transformed bets
//   } catch (error) {
//     console.error("Error loading bets from backend:", error.response || error);
//   }
// };

// // On mount, prioritize loading bets from AsyncStorage
// useEffect(() => {
//   const loadBets = async () => {
//     const storedBets = await AsyncStorage.getItem(`bets-${battleId}`);
//     if (storedBets) {
//       const parsedBets = JSON.parse(storedBets);
//       console.log("Loaded bets from AsyncStorage:", parsedBets);
//       setBets(parsedBets);
//     }

//     // If no stored bets OR betslip is 'submitted', load from backend
//     if (!storedBets && betslipStatus === "submitted") {
//       console.log("Loading bets from backend...");
//       await loadBetsFromBackend();
//     }
//   };

//   loadBets();
// }, [battleId]);

// BattleDetails
// Fetch games from the backend
// const fetchGames = async () => {
//   try {
//     if (!battleId) {
//       console.error("No battleId provided");
//       return;
//     }

//     const response = await api.get(`/games`, {
//       params: { battle_id: battleId }, // assuming id corresponds to battle_id
//     });
//     setGames(response.data);
//   } catch (error) {
//     console.error("Error fetching games:", error);
//   }
// };

// // Fetch the betslip status from the backend
// const fetchBetslipStatus = async () => {
//   try {
//     const betslipResponse = await api.get(
//       `/pools/${poolId}/battles/${battleId}/betslips/${betslipId}`
//     );
//     setBetslipStatus(betslipResponse.data.status); // Store betslip status
//   } catch (error) {
//     console.error("Error fetching betslip status:", error);
//   }
// };

// useEffect(() => {
//   const fetchData = async () => {
//     await fetchGames();
//     await fetchBetslipStatus();
//     setLoading(false); // Set loading to false once both requests are complete
//   };

//   fetchData();
// }, [battleId]);
