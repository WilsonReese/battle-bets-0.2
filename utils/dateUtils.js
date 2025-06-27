import { parseISO, format, addWeeks } from "date-fns";

export function formatMembershipJoinDate(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now - createdDate;

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffYears = now.getFullYear() - createdDate.getFullYear();

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 365) return `${diffDays}d ago`;
  return `${createdDate.getFullYear()}`;
}

export function formatFullDate(dateString) {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "MMMM dd, yyyy");
  } catch (e) {
    console.error("Invalid date passed to formatFullDate:", dateString);
    return dateString;
  }
}

/**
 * Returns the Date object for the start of the given week.
 * Week 1 starts on Monday, August 25, 2025 at 7:00 AM local time.
 *
 * @param {number} week - Week number (1-based)
 * @returns {Date}
 */
export function getLeagueWeekStartDateTime(week) {
  if (!week || week < 1) throw new Error("Week must be >= 1");

  // August 25, 2025 at 7:00 AM local time
  const baseDate = new Date(2025, 7, 25, 7, 0, 0); // Month 7 = August (0-based)

  return addWeeks(baseDate, week - 1);
}