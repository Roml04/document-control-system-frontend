import { Separator } from "~/components/ui/separator";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/requests";
import type { UserType } from "~/constants/types";
import { Ellipsis } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import enumFormatter from "~/utils/enumFormatter";
import { Button } from "~/components/ui/button";
import type { REQUESTSTATUS } from "~/constants/enums";
import { ScrollArea } from "~/components/ui/scroll-area";

type Request = {
  id: number;
  title: string;
  reason: string;
  status: REQUESTSTATUS;
  uploadDate: string;
  user: UserType;
};

export async function clientLoader() {
  const apiResponse = await apiFetch("/request");

  return apiResponse as {
    ok: boolean;
    data: Request[];
    message: string;
  };
}

export default function requests({ loaderData }: Route.ComponentProps) {
  const { ok, data, message } = loaderData;

  console.log(data);
  console.log(ok);
  console.log(message);

  const columnWidths = {
    title: "w-3/20",
    reason: "max-w-[50em]",
    status: "w-3/20",
    author: "w-3/20",
    uploadDate: "w-3/20",
    action: "w-1/20",
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>Requests</h1>
      <Separator />
      <div className="flex-1">
        <ScrollArea className="h-[54em]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={`${columnWidths.title} `}>
                  Title
                </TableHead>
                <TableHead className={`${columnWidths.reason}`}>
                  Reason
                </TableHead>
                <TableHead className={`${columnWidths.status}`}>
                  Status
                </TableHead>
                <TableHead className={`${columnWidths.author}`}>
                  Author
                </TableHead>
                <TableHead className={`${columnWidths.uploadDate}`}>
                  Upload Date
                </TableHead>
                <TableHead className={`${columnWidths.action} text-center`}>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((request) => {
                let textStyle = "";

                switch (request.status) {
                  case "denied":
                    textStyle = "text-destructive";
                    break;

                  case "approved":
                    textStyle = "text-green-600";
                    break;

                  default:
                    textStyle = "";
                }

                return (
                  <TableRow className="cursor-pointer">
                    <TableCell className={`${columnWidths.title}`}>
                      {request.title}
                    </TableCell>
                    <TableCell className={`${columnWidths.reason} truncate`}>
                      {request.reason}
                    </TableCell>
                    <TableCell
                      className={`${columnWidths.status} ${textStyle}`}
                    >
                      {enumFormatter(request.status)}
                    </TableCell>
                    <TableCell
                      className={`${columnWidths.author}`}
                    >{`${request.user.firstName} ${request.user.lastName}`}</TableCell>
                    <TableCell className={`${columnWidths.uploadDate}`}>
                      {request.uploadDate}
                    </TableCell>
                    <TableCell className={`flex justify-center items-center`}>
                      <Button
                        className="cursor-pointer"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => {
                          // OPERATIONS
                        }}
                      >
                        <Ellipsis />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
