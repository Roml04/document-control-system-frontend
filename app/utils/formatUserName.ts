export function formatUserName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  return name || "Unknown User";
}
