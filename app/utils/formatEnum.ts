// coordinator_approval
export default function formatEnum(str: string | null) {
  if (!str) {
    return null;
  }

  let strArr = str.split("_");

  return strArr
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
