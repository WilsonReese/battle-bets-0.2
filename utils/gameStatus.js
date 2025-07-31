// utils/gameStatus.js

export const StatusGroup = {
  NOT_STARTED:   "Not Started",
  IN_PROGRESS:   "In Progress",
  FINISHED:      "Finished",
  CANCELLED:     "Cancelled",
  POSTPONED:     "Postponed",
};

// these are the raw codes coming back from the API
const RAW = {
  NS:   "NS",
  Q1:   "Q1",
  Q2:   "Q2",
  Q3:   "Q3",
  Q4:   "Q4",
  OT:   "OT",
  HT:   "HT",
  FT:   "FT",
  AOT:  "AOT",
  CANC: "CANC",
  PST:  "PST",
};

const QUARTER_MAP = {
  Q1: "1st",
  Q2: "2nd",
  Q3: "3rd",
  Q4: "4th",
  OT: "OT",
  HT: "Half",
};

export function formatQuarter(code) {
  return QUARTER_MAP[code] || code;
}

// which codes map into which group
const GROUP_MAP = {
  [StatusGroup.NOT_STARTED]: new Set(["NS"]),
  [StatusGroup.IN_PROGRESS]: new Set(["Q1","Q2","Q3","Q4","OT","HT"]),
  [StatusGroup.FINISHED]:    new Set(["FT","AOT"]),
  [StatusGroup.CANCELLED]:   new Set(["CANC"]),
  [StatusGroup.POSTPONED]:   new Set(["PST"]),
};

/**
 * Given an API short status code (e.g. "Q1", "FT", "NS"),
 * returns one of the StatusGroup values.
 * If it doesn’t match any known code, returns null.
 */
export function categorizeStatus(code) {
  for (let [group, codes] of Object.entries(GROUP_MAP)) {
    if (codes.has(code)) return group;
  }
  return null;
}

/**
 * Quick predicates if you just want boolean checks.
 */
export function isNotStarted(code) {
  return GROUP_MAP[StatusGroup.NOT_STARTED].has(code);
}
export function isInProgress(code) {
  return GROUP_MAP[StatusGroup.IN_PROGRESS].has(code);
}
export function isFinished(code) {
  return GROUP_MAP[StatusGroup.FINISHED].has(code);
}
export function isCancelled(code) {
  return GROUP_MAP[StatusGroup.CANCELLED].has(code);
}
export function isPostponed(code) {
  return GROUP_MAP[StatusGroup.POSTPONED].has(code);
}