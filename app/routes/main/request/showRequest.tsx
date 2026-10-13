import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/showRequest";
import formatEnum from "~/utils/formatEnum";
import { Download, PackageOpen } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type {
  CommenterType,
  CommentType,
  RequestType,
  UserType,
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import RequestTypeBadge from "~/components/primitives/RequestTypeBadge";
import FileTypeBadge from "~/components/primitives/FileTypeBadge";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import { downloadFile } from "~/utils/downloadFile";
import type { CommentWithUserType } from "~/utils/groupCommentsByUse";
import groupCommentsByUser from "~/utils/groupCommentsByUse";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/request/${params.id}`);

  console.log(`INFO | /request/${params.id} [MAIN]`, apiResponse);

  return apiResponse.data as RequestType & {
    version: VersionType;
    comments: CommentWithUserType[];
  };
}

export default function showRequest({ loaderData }: Route.ComponentProps) {
  const request = loaderData;

  const version = request.version;

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <div className="flex gap-6 h-[55em]">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col border p-4 rounded-lg gap-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col">
                <h1>{request.title}</h1>
              </div>
              <div className="flex items-center gap-1">
                <RequestTypeBadge type={request.type} />
                <Badge>{formatEnum(request.status)}</Badge>
              </div>
            </div>
            <div className="flex flex-col bg-secondary p-4 border rounded-lg">
              <p className="text-muted-foreground">Reason</p>
              <p className="text-secondary-foreground">{request.reason}</p>
            </div>
          </div>

          {/* DEV-NOTE: Turn this into a component */}
          {version ? (
            <div className="flex flex-col border p-4 rounded-lg gap-4">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="flex justify-center items-center rounded-sm bg-gray-200 aspect-square h-12">
                    <FileTypeBadge type={version.fileType} size={22} />
                  </div>
                  <div className="flex flex-col">
                    <h3>{version.fileTitle}</h3>
                    <p>{formatEnum(version.fileType)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <NavLink
                    to={`/onlyoffice/${version.id}?mode=view`}
                    target="_blank"
                  >
                    <Button variant={"ghost"}>Open in editor</Button>
                  </NavLink>
                  <Button
                    size={"icon-lg"}
                    variant={"ghost"}
                    title="Download"
                    onClick={() => {
                      downloadFile(version.id, version.fileName);
                    }}
                  >
                    <Download size={18} />
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-4 gap-y-4">
                <div>
                  <p className="text-muted-foreground">Originator</p>
                  <p>{version.originator ?? "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p>{version.department ?? "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revision Number</p>
                  <p>{version.revisionNumber ?? "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revision Details</p>
                  <p>{version.revisionDetails ?? "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Upload Date</p>
                  <p>{version.uploadDate ?? "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revision Date</p>
                  <p>{version.revisionDate ?? "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approver</p>
                  <p>
                    {formatUserName(
                      version.approver.firstName,
                      version.approver.lastName,
                    ) ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approved Date</p>
                  <p>{version.approvedDate ?? "--"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col border p-4 rounded-lg gap-4">
              <Empty>
                <EmptyHeader className="gap-1">
                  <EmptyMedia variant={"icon"}>
                    <PackageOpen />
                  </EmptyMedia>
                  <EmptyTitle>Version not found</EmptyTitle>
                  <EmptyDescription>
                    The version you're looking for may have been deleted or is
                    no longer available.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
          <div className="flex flex-col p-4 gap-4">
            <p className="text-muted-foreground">Comments</p>
            {request.comments.length > 0 ? (
              <div className="px-4 border-l flex flex-col gap-6">
                {groupCommentsByUser(request.comments).map((group, index) => {
                  const { user, comments } = group;

                  return (
                    <Message key={index}>
                      <MessageAvatar>
                        <Avatar>
                          <AvatarImage />
                          <AvatarFallback>
                            {avatarFallback(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent className="gap-0">
                        <MessageHeader>{`${formatUserName(user.firstName, user.lastName)} (${formatEnum(user.role)})`}</MessageHeader>
                        <BubbleGroup>
                          {comments.map((comment, commentIndex) => {
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
