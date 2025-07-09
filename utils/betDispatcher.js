let addBetFn = null;

export const registerAddBet = (fn) => {
  addBetFn = fn;
};

export const addBetToContext = (bet) => {
  if (addBetFn) {
    addBetFn(bet);
  } else {
    console.warn("addBetFn not registered");
  }
};