import dynamic from "next/dynamic";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./workspace/hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/convex/auth";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./channel/toolbar";

const Renderer = dynamic(() => import("./rendered"), { ssr: false });

type MessageProps = {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  updatedAt: Doc<"messages">["_creationTime"];
  createdAt: Doc<"messages">["updateAt"];
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
};

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};
export const Message = ({
  id,
  image,
  body,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 pb-2 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-start gap-2">
          {/*          <Hint label={formatFullTime(new Date(createdAt || Date.now()))}> */}
          {/*   <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] text-center hover:underline leading-[22px]"> */}
          {/*     {format(new Date(createdAt || Date.now()), "hh:mm")} */}
          {/*   </button> */}
          {/* </Hint> */}
          <div className="flex flex-col w-full pl-10">
            <Renderer value={body} />
            <Thumbnail url={image} />

            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={() => {}}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();
  return (
    <div className="flex flex-col gap-2 py-0.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="rounded-full">
            <AvatarImage src={authorImage} />
            <AvatarFallback className="bg-gray-500 text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button
              className="font-bold text-primary hover:underline"
              onClick={() => {}}
            >
              {authorName}
            </button>
            <span>&nbsp;&nbsp;</span>
            <Hint label={formatFullTime(new Date(createdAt || Date.now()))}>
              <button className="text-xs text-muted-foreground hover:underline">
                {format(new Date(createdAt || Date.now()), "hh:mm a")}
              </button>
            </Hint>{" "}
          </div>
          <Renderer value={body} />
          <Thumbnail url={image} />
          {updatedAt ? (
            <span className="text-xs text-muted-foreground">(edited)</span>
          ) : null}
        </div>
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};
