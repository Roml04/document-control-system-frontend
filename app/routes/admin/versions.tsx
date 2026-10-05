import Header from "~/components/organisms/Header";
import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/versions";
import type { VersionType } from "~/constants/types";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { PackageOpen } from "lucide-react";
import VersionListHeader, {
  VersionListItem,
} from "~/components/organisms/VersionList";

export async function clientLoader() {
  const fetchedVersions = await apiFetch("/admin/version");

  return fetchedVersions.data as VersionType[];
}

export default function versions({ loaderData }: Route.ComponentProps) {
  const versions = loaderData;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between">
        <h1>Versions</h1>
      </div>
      <Separator />
      <div className="h-[50em]">
        {versions.length !== 0 ? (
          <ul>
            <VersionListHeader />
            <ScrollArea className="h-[50em]">
              {versions.map((version, index) => (
                <VersionListItem key={index} version={version} />
              ))}
            </ScrollArea>
          </ul>
        ) : (
          <Empty className="h-full">
            <EmptyHeader className="gap-1">
              <EmptyMedia variant={"icon"}>
                <PackageOpen />
              </EmptyMedia>
              <EmptyTitle>No users to display</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}
