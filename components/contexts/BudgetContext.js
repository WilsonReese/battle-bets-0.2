// components/contexts/BudgetContext.js
import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import { DEFAULT_BUDGETS } from "../../utils/betting-rules";

const BudgetContext = createContext(null);

export const useBudgets = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudgets must be used inside <BudgetProvider>");
  return ctx;
};

export const BudgetProvider = ({ children }) => {
  const [budgetsByBattle, setBudgetsByBattle] = useState({}); // { [battleId]: { spreadOU, moneyLine, prop } }

  /** read-only selector */
  const getBudgetForBattle = useCallback(
    (id) => budgetsByBattle[id] ?? DEFAULT_BUDGETS,
    [budgetsByBattle]
  );

  /** action that BetContext will call after it finishes (re)loading bets */
  const updateBudgetForBattle = useCallback((id, budget) => {
    setBudgetsByBattle((prev) => ({ ...prev, [id]: budget }));
  }, []);

  const value = useMemo(
    () => ({ getBudgetForBattle, updateBudgetForBattle }),
    [getBudgetForBattle, updateBudgetForBattle]
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};