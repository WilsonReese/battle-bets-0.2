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

// which codes map into which group
const GROUP_MAP = {
  [StatusGroup.NOT_STARTED]:   new Set([ RAW.NS ]),
  [StatusGroup.IN_PROGRESS]:   new Set([ RAW.Q1, RAW.Q2, RAW.Q3, RAW.Q4, RAW.OT, RAW.HT ]),
  [StatusGroup.FINISHED]:      new Set([ RAW.FT, RAW.AOT ]),
  [StatusGroup.CANCELLED]:     new Set([ RAW.CANC ]),
  [StatusGroup.POSTPONED]:     new Set([ RAW.PST ]),
};

/**
 * Given an API short status code (e.g. "Q1", "FT", "NS"),
 * returns one of the StatusGroup values.
 * If it doesn’t match any known code, returns null.
 */
export function categorizeStatus(code) {
  for (const [group, setOfCodes] of Object.entries(GROUP_MAP)) {
    if (setOfCodes.has(code)) {
      return group;
    }
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