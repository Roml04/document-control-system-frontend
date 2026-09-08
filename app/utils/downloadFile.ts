import { apiFileFetch } from "./apiFileFetch";

export async function downloadFile(versionId: number) {
  const response = await apiFileFetch(`/version/${versionId}/file`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");

  URL.revokeObjectURL(url);
}
