import Header from "~/components/organisms/Header";
import type { Route } from "./+types/showFile";
import { apiFetch } from "~/utils/apiFetch";
import type { FileType, VersionType } from "~/constants/types";
import { Download, Ellipsis, PackageOpen } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import formatEnum from "~/utils/formatEnum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/components/ui/sheet";
import { useState, type SubmitEventHandler } from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import LoadingButton from "~/components/primitives/LoadingButton";
import { toast } from "sonner";
import FileTypeBadge from "~/components/primitives/FileTypeBadge";
import { apiFileFetch } from "~/utils/apiFileFetch";
import { downloadFile } from "~/utils/downloadFile";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/file/${params.id}`);

  console.log("INFO | CLIENT LOADER", apiResponse);

  return apiResponse.data as FileType & {
    latestVersion: VersionType;
    versions: VersionType[];
  };
}

export default function showFile({ loaderData }: Route.ComponentProps) {
  const file = loaderData;
  const latestVersion = file.latestVersion;

  const [openReviseSheet, setOpenReviseSheet] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestReason, setRequestReason] = useState("");

  const [isSpinning, setIsSpinning] = useState(false);
  console.log("INFO | loaderData", file);

  /**
   * Functions
   */
  const handleReviseRequest: SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    try {
      event.preventDefault();
      setIsSpinning(true);

      const apiResponse = await apiFetch("/request", {
        method: "POST",
        body: JSON.stringify({
          type: "rev",
          title: requestTitle,
          reason: requestReason,
          latestVersionId: latestVersion.id,
        }),
      });

      if (!apiResponse.ok) {
        return toast.error("Failed to submit revise request", {
          position: "top-center",
          description: apiResponse.message,
        });
      }

      console.log("INFO | apiResponse", apiResponse);

      setRequestTitle("");
      setRequestReason("");
      setOpenReviseSheet(false);
    } catch (error) {
      toast.error("An error occurred", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again in a moment",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  const colSpan = {
    revisionNumber: "col-span-5",
    author: "col-span-5",
    approvedDate: "col-span-5",
    action: "col-span-1",
  };

  const gridCols = "grid grid-cols-16";

  return (
    <>
      <div className="flex flex-col gap-2">
        <Header />
        {/* FILE */}
        <div className="flex flex-col border rounded-lg p-4 justify-center gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
                <FileTypeBadge type={file.type} size={22} />
              </div>
              <div className="flex flex-col">
                <h1>{file.title}</h1>
                <p>{formatEnum(file.type)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                title="Download"
                onClick={() => {
                  downloadFile(latestVersion.id, latestVersion.fileName);
                }}
              >
                <Download size={18} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon-lg"}>
                    <Ellipsis size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setOpenReviseSheet(true)}>
                      Revise
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Separator />
          <div>
            <div className="grid grid-cols-4 gap-y-4">
              <div>
                <p className="text-muted-foreground">Originator</p>
                <p>{latestVersion.originator}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p>{latestVersion.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revision Number</p>
                <p>{latestVersion.revisionNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revision Detail</p>
                <p>{latestVersion.revisionDetails}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Upload Date</p>
                <p>{latestVersion.uploadDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revision Date</p>
                <p>{latestVersion.revisionDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Approver</p>
                <p>{latestVersion.approver}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Approved Date</p>
                <p>{latestVersion.approvedDate}</p>
              </div>
            </div>
          </div>
        </div>
        {/* VERSIONS */}
        <div className="flex flex-col border rounded-lg justify-center">
          <div className="flex flex-col">
            <h3 className="p-4">Version History</h3>
            <Separator />
          </div>
          {/* HEADER */}
          <div className="flex flex-col">
            <div className={`${gridCols} p-4`}>
              <div className={`${colSpan.revisionNumber}`}>
                <h3>Revision Number</h3>
              </div>
              <div className={`${colSpan.author}`}>
                <h3>Author</h3>
              </div>
              <div className={`${colSpan.approvedDate}`}>
                <h3>Approved Date</h3>
              </div>
              <div className={`${colSpan.action}`}>
                <h3>Action</h3>
              </div>
            </div>
          </div>
          {/* <Separator /> */}
          {file.versions.length !== 0 ? (
            <ul className="flex flex-col">
              <ScrollArea className="h-[34em]">
                {file.versions.map((version, index) => (
                  <li key={index} className={`hover:bg-accent`}>
                    <div className={`${gridCols} p-4`}>
                      <div
                        className={`col-span-15 grid grid-cols-15 content-center`}
                      >
                        <p className={`${colSpan.revisionNumber}`}>
                          {version.revisionNumber}
                        </p>
                        <p className={`${colSpan.author}`}>
                          {version.originator}
                        </p>
                        <p className={`${colSpan.approvedDate}`}>
                          {version.approvedDate}
                        </p>
                      </div>
                      <div className={`${colSpan.action}`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant={"ghost"} size={"icon"}>
                              <Ellipsis />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => {}}>
                                View
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </li>
                ))}
              </ScrollArea>
            </ul>
          ) : (
            <div className="h-[34em] flex justify-center">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={"icon"}>
                    <PackageOpen />
                  </EmptyMedia>
                  <EmptyTitle>No versios to display</EmptyTitle>
                  <EmptyDescription>
                    There are currently no versions available for viewing.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </div>
      <Sheet
        open={openReviseSheet}
        onOpenChange={(open) => {
          setOpenReviseSheet(open);

          if (!open) {
            setRequestTitle("");
            setRequestReason("");
          }
        }}
      >
        <SheetContent
          className="w-[30vw] sm:max-w-[30vw]! h-dvh p-0"
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
        >
          <form
            onSubmit={handleReviseRequest}
            className="flex h-full min-h-0 flex-col"
          >
            <SheetHeader>
              <h1>Revise a File</h1>
              <p>Submit a revise file request.</p>
            </SheetHeader>
            <Separator />

            <ScrollArea className="flex-1 min-h-0 px-4 py-4">
              <FieldSet>
                <FieldGroup>
                  <h2>Request Details</h2>
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      value={requestTitle}
                      onChange={(e) => setRequestTitle(e.target.value)}
                      type="text"
                      placeholder="e.g., Request for document upload"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reason">Reason</FieldLabel>
                    <Textarea
                      id="reason"
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="Describe the purpose or reason for submitting this request..."
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </ScrollArea>
            <Separator />
            <SheetFooter>
              <LoadingButton
                displayText="Submit Request"
                loadingDisplayText="Submitting request..."
                isSpinning={isSpinning}
              />
              {/* <Button type="submit">Submit Request</Button> */}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
