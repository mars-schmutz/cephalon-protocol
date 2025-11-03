/**
 * Format a number with K, M, B suffixes for readability
 * @param num - The number to format
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted string with suffix
 */
export function formatNumber(num: number, precision: number = 2): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(precision) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(precision) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(precision) + "K";
  }
  return Math.floor(num).toString();
}

/**
 * Format seconds into human-readable time string
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "1h 30m", "45m 20s", "30s")
 */
export function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  } else if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
  return `${seconds}s`;
}
