// Utility: Format UTC timestamp
export const formatDate = (utc: number): string => {
  const d = new Date(utc * 1000);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};