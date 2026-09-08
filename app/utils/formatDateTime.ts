export function formatDateTime(dateString: string): string {
  const match = dateString.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})(AM|PM)$/,
  );

  if (!match) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  const [, year, month, day, hour, minute, period] = match;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour) + (period === "PM" && Number(hour) !== 12 ? 12 : 0),
    Number(minute),
  );

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    hour12: true,
  })
    .format(date)
    .replace(":00", "");
}
