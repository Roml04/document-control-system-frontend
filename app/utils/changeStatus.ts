import { REVISIONSTATUS } from "~/constants";

export function changeStatus(status: REVISIONSTATUS) {
  const statusArray = [
    REVISIONSTATUS.COORDINATOR,
    REVISIONSTATUS.ORIGINATOR,
    REVISIONSTATUS.SUPERIOR,
    REVISIONSTATUS.APPROVED,
  ];

  if (status === REVISIONSTATUS.APPROVED) return status;

  let statusIndex = statusArray.indexOf(status);
  const newStatus = statusArray[statusIndex + 1];

  return newStatus;
}
