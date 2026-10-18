import { apiFetch } from "~/utils/apiFetch";

export default async function checkStatus(versionId: number): Promise<boolean> {
  const apiResponse = await apiFetch(`/version/${versionId}/status`);

  console.log(`INFO | RESPONSE FROM /version/${versionId}/status`, apiResponse);

  return apiResponse.saved;
}
