import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/showRequest";
import formatEnum from "~/utils/formatEnum";
import { Box, Download, Ellipsis, PackageOpen } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type {
  CommenterType,
  RequestType,
  VersionType,
} from "~/constants/types";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "~/components/ui/message";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Bubble, BubbleContent, BubbleGroup } from "~/components/ui/bubble";
import avatarFallback from "~/utils/avatarFallback";
import { formatUserName } from "~/utils/formatUserName";
import { apiFetch } from "~/utils/apiFetch";
import Header from "~/components/organisms/Header";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import RequestTypeBadge from "~/components/primitives/RequestTypeBadge";
import FileTypeBadge from "~/components/primitives/FileTypeBadge";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import { downloadFile } from "~/utils/downloadFile";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/request/${params.id}`);

  console.log("INFO | request.tsx cientLoader(),", apiResponse);

  return apiResponse.data as RequestType & {
    version: VersionType;
    commenters: CommenterType[];
  };
}

export default function showRequest({ loaderData }: Route.ComponentProps) {
  const request = loaderData;

  return (
    <div className="flex flex-col gap-2">
      <Header />
      <div className="flex gap-6 h-[55em]">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full justify-between items-center py-2">
            <div className="flex flex-col">
              <h1>{request.title}</h1>
            </div>
            <div className="flex items-center gap-1">
              <RequestTypeBadge type={request.type} />
              <Badge>{formatEnum(request.status)}</Badge>
            </div>
          </div>

          {/* DEV-NOTE: Turn this into a component */}
          <div className="flex justify-between border p-4 rounded-lg">
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
                <FileTypeBadge type={request.version.fileType} size={22} />
              </div>
              <div className="flex flex-col">
                <h3>{request.version.fileTitle}</h3>
                <p>{formatEnum(request.version.fileType)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <NavLink
                to={`/onlyoffice/${request.version.id}?mode=view`}
                target="_blank"
              >
                <Button variant={"ghost"}>Open in editor</Button>
              </NavLink>
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                title="Download"
                onClick={() => {
                  downloadFile(request.version.id, request.version.fileName);
                }}
              >
                <Download size={18} />
              </Button>
            </div>
          </div>

          <div className="border rounded-lg">
            <div className="grid grid-cols-4 gap-y-4 p-4">
              <div>
                <p className="text-muted-foreground">Originator</p>
                <p>{request.version.originator ?? "--"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p>{request.version.department ?? "--"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revision Number</p>
                <p>{request.version.revisionNumber ?? "--"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revision Detail</p>
                <p>{request.version.revisionDetails ?? "--"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Upload Date</p>
                <p>{request.version.uploadDate ?? "--"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revision Date</p>
                <p>{request.version.revisionDate ?? "--"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Approver</p>
                <p>{request.version.approver ?? "--"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Approved Date</p>
                <p>{request.version.approvedDate ?? "--"}</p>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col p-4">
              <div className="flex flex-col bg-secondary p-4 border rounded-lg">
                <p className="text-muted-foreground">Reason</p>
                <p className="text-secondary-foreground">{request.reason}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-4 gap-4">
            <p className="text-muted-foreground">Comments</p>
            {request.commenters.length > 0 ? (
              <div className="px-4 border-l flex flex-col gap-6">
                {request.commenters.map((commenter, index) => {
                  return (
                    <Message key={index}>
                      <MessageAvatar
                        title={formatUserName(
                          commenter.firstName,
                          commenter.lastName,
                        )}
                      >
                        <Avatar>
                          <AvatarImage />
                          <AvatarFallback>
                            {avatarFallback(
                              commenter.firstName,
                              commenter.lastName,
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent className="gap-0">
                        <MessageHeader>{commenter.role}</MessageHeader>
                        <BubbleGroup>
                          {commenter.comments.map((comment, commentIndex) => {
                            return (
                              <Bubble variant={"muted"} key={commentIndex}>
                                <BubbleContent>{comment.content}</BubbleContent>
                              </Bubble>
                            );
                          })}
                        </BubbleGroup>
                      </MessageContent>
                    </Message>
                  );
                })}
              </div>
            ) : (
              <Empty>
                <EmptyHeader className="gap-1">
                  <EmptyMedia variant={"icon"}>
                    <PackageOpen />
                  </EmptyMedia>
                  <EmptyTitle>No comments available</EmptyTitle>
                  {/* <EmptyDescription></EmptyDescription> */}
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
