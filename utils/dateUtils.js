import { parseISO, format } from "date-fns";

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