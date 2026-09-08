import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/reviewRequest";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Download, PackageOpen } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import formatEnum from "~/utils/formatEnum";
import { Separator } from "~/components/ui/separator";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "~/components/ui/message";
import { Bubble, BubbleContent, BubbleGroup } from "~/components/ui/bubble";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { toast } from "sonner";
import type { CommentType, RequestType, VersionType } from "~/constants/types";
import avatarFallback from "~/utils/avatarFallback";
import { formatUserName } from "~/utils/formatUserName";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import FileTypeBadge from "~/components/primitives/FileTypeBadge";
import RequestTypeBadge from "~/components/primitives/RequestTypeBadge";
import { downloadFile } from "~/utils/downloadFile";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const apiResponse = await apiFetch(`/request/${params.id}`);

  return apiResponse.data as RequestType & {
    version: VersionType;
    comment: CommentType[];
  };
}

export default function reviewRequest({ loaderData }: Route.ComponentProps) {
  /**
   * Hooks
   */
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  const request = loaderData;

  console.log("INFO | REQUEST", request);

  /**
   * Functions
   */

  const handleReviewRequest = async (
    isApproved: boolean,
    requestId: number,
  ) => {
    try {
      if (!isApproved && !comment) {
        return toast.error("Comment is required", {
          position: "top-center",
          description: "A comment is required when denying a request.",
        });
      }

      const apiResponse = await apiFetch(`/request/${request.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          isApproved: isApproved,
          comment: comment,
          requestId: requestId,
        }),
      });

      if (!apiResponse.ok) {
        return toast.error("Failed to submit review", {
          position: "top-center",
          description: apiResponse.message,
        });
      }

      toast.success("Review submitted succesfully", {
        position: "top-center",
      });

      navigate("/requests");
    } catch (error) {
      toast.error("An error occurred", {
        position: "top-center",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again in a moment",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <header className="">
        <Button variant={"ghost"} onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
      </header>
      <div className="flex gap-6 h-[55em]">
        <div className="flex flex-col gap-2 w-3/5">
          <div className="flex w-full justify-between items-center py-2">
            <div className="flex flex-col">
              <h1>{request.title}</h1>
              <p className="text-muted-foreground"></p>
            </div>
            <div className="flex items-center gap-1">
              <RequestTypeBadge type={request.type} />
              <Badge>{formatEnum(request.status)}</Badge>
            </div>
          </div>

          {/* FILE COMPONENT */}
          <div className="p-4 border rounded-l items-center flex justify-between">
            <div className="flex items-center gap-2">
              <FileTypeBadge type={request.version.fileType} />
              <div className="flex flex-col">
                <h3>{request.version.fileTitle}</h3>
                <p>{request.version.fileType}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <NavLink
                to={`/onlyoffice/${request.version.id}?mode=view`}
                target="_blank"
              >
                <Button variant={"ghost"}>Open in editor</Button>
              </NavLink>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() =>
                  downloadFile(request.version.id, request.version.fileName)
                }
              >
                <Download />
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
        <Separator orientation="vertical" />
        <form className="flex flex-col w-2/5 gap-2">
          <h2>Review Request</h2>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="comment">Comment</FieldLabel>
                <Textarea
                  id="comment"
                  placeholder="Enter your comment or reason for denial..."
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  required
                />
                <FieldDescription>
                  Comment is required only when denying a request.
                </FieldDescription>
              </Field>
              <Field>
                <div className="flex gap-1 justify-end">
                  <Button
                    type="button"
                    onClick={() => handleReviewRequest(true, request.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={() => handleReviewRequest(false, request.id)}
                  >
                    Deny
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </div>
  );
}
