import type { Route } from "./+types/showFile";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { id: params.id };
}

export default function showFile({ loaderData }: Route.ComponentProps) {
  const { id } = loaderData;
  return <div>Show File ID: {id}</div>;
}
