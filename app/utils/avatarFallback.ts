export default function (firstName?: string | null, lastName?: string | null) {
  const fallbackName = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;
  return fallbackName;
}
