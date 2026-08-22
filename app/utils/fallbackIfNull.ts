export default function fallbackIfNull<T>(value: T | null, fallback: string) {
  return value ?? fallback;
}
