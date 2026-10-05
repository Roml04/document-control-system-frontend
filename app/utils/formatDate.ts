export function formatDate(input: string) {
  const match = String(input)
    .trim()
    .match(
      /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i,
    );

  if (!match) {
    throw new Error(`Invalid date format: "${input}"`);
  }

  const [, year, month, day, hour, minute, second = "00", meridiem] = match;

  let h = parseInt(hour, 10) % 12; // 12AM -> 0, 12PM -> 0 (then +12 below)
  if (meridiem.toUpperCase() === "PM") h += 12;

  return `${year}-${month}-${day} ${String(h).padStart(2, "0")}:${minute}:${second}`;
}
