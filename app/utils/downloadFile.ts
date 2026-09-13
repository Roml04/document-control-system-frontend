import { toast } from "sonner";
import { apiFileFetch } from "./apiFileFetch";

export async function downloadFile(versionId: number, fileName: string) {
  const apiFileResponse = await apiFileFetch(`/version/${versionId}/file`);

  const response = await apiFileResponse;

  if (!response.ok) {
    return toast.error("Could not open file", {
      position: "top-center",
    });
  }

  const blob = await apiFileResponse.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
