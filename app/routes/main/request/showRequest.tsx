import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/showRequest";
import { useNavigate } from "react-router";
import enumFormatter from "~/utils/enumFormatter";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";
import { apiFetch } from "~/utils/apiFetch";

export async function clientLoader({ params }: Route.ClientActionArgs) {
  const apiResponse = await apiFetch(`/request/${params.id}`);

  console.log("INFO | request.tsx cientLoader(),", apiResponse);

  return apiResponse.data as RequestType & {
    version: VersionType;
    commenters: CommenterType[];
  };
}

export default function showRequest({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const request = loaderData;

  return (
    <div className="flex flex-col gap-2">
      <header className="">
        <Button variant={"ghost"} onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
      </header>
      <div className="flex gap-6 h-[55em]">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full justify-between items-center py-2">
            <div className="flex flex-col">
              <h1>{request.title}</h1>
              <p className="text-muted-foreground"></p>
            </div>
            <Badge>{enumFormatter(request.status)}</Badge>
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
          </div>
        </div>
      </div>
    </div>
  );
}
