import type { Route } from "./+types/editVersion";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {}

export default function editVersion({ loaderData }: Route.ComponentProps) {
  return <div>Edit Request</div>;
}
