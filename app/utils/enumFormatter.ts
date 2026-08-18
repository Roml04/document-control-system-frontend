// coordinator_approval
export default function enumFormatter(str: string) {
  if (!str) {
    return null;
  }

  let strArr = str.split("_");

  return strArr
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
