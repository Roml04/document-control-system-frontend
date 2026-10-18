import type { CommentType, UserType } from "~/constants/types";

export type CommentWithUserType = CommentType & {
  user: Pick<UserType, "id" | "firstName" | "lastName" | "role">;
};

export type CommentGroup = {
  user: CommentWithUserType["user"];
  comments: CommentWithUserType[];
};

export default function groupCommentsByUser(comments: CommentWithUserType[]) {
  const groups: CommentGroup[] = [];

  for (const comment of comments) {
    const last = groups[groups.length - 1];

    if (last && last.user.id === comment.user.id) {
      last.comments.push(comment);
    } else {
      groups.push({ user: comment.user, comments: [comment] });
    }
  }

  return groups;
}
