export function getOrdinalSuffix(rank) {
  const j = rank % 10;
  const k = rank % 100;

  if (k === 11 || k === 12 || k === 13) return rank + "th";
  if (j === 1) return rank + "st";
  if (j === 2) return rank + "nd";
  if (j === 3) return rank + "rd";
  return rank + "th";
}