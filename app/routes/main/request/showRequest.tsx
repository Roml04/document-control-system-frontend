import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/showRequest";
import { Sheet, SheetContent, SheetHeader } from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useNavigate } from "react-router";

export async function clientLoader({ params }: Route.ClientActionArgs) {
  const requestId = params.id;
  return requestId;
}

export default function showRequest({ loaderData }: Route.ComponentProps) {
  const requestId = loaderData;
  const navigate = useNavigate();
  return <div>Request ID: {requestId}</div>;
}
