import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { Hint } from "./workspace/hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./channel/toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { useToggleReaction } from "@/features/reactions/use-toggle-reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";

const Renderer = dynamic(() => import("./rendered"), { ssr: false });

const Editor = dynamic(() => import("./channel/editor"), { ssr: false });

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
  editingId: Id<"messages"> | null;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton: boolean;
  threadCount?: number;
  threadName?: string;
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
  editingId,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadName,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be undone.",
  );

  const { onOpenMessage, onOpenProfile, onCloseMessage, parentMessageId } =
    usePanel();

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending = isUpdatingMessage || isTogglingReaction;

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message delete");
          if (parentMessageId === id) {
            onCloseMessage();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      },
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError() {
          toast.error("Failed to toggle reaction");
        },
      },
    );
  };
  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess() {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError() {
          toast.error("Failed to update the message");
        },
      },
    );
  };

  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 py-0.5 px-5 hover:bg-gray-100/60 group relative",
          isRemovingMessage &&
            "bg-gray-500/50 transform transition-all scale-y-0 origin-bottom duration-200",
        )}
      >
        <ConfirmDialog />
        <div className="gap-2">
          {editingId === id ? (
            <div>
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                variant="update"
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full pl-10">
              <Renderer value={body} />
              <Thumbnail url={image} />

              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                name={threadName}
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!editingId && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();
  return (
    <div
      className={cn(
        "flex flex-col gap-2 py-0.5 px-5 hover:bg-gray-100/60 group relative",
        isRemovingMessage &&
          "bg-gray-500/50 transform transition-all scale-y-0 origin-bottom duration-200",
      )}
    >
      <ConfirmDialog />
      <div className="flex items-start gap-2">
        <button onClick={() => onOpenProfile(memberId)}>
          <Avatar className="rounded-full">
            <AvatarImage src={authorImage} />
            <AvatarFallback className="bg-gray-500 text-white">
              {avatarFallback.toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        {editingId === id ? (
          <div className=" w-full h-full">
            <Editor
              onSubmit={handleUpdate}
              disabled={isPending}
              defaultValue={JSON.parse(body)}
              variant="update"
              onCancel={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button
                className="font-bold text-primary hover:underline"
                onClick={() => onOpenProfile(memberId)}
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
            <Reactions data={reactions} onChange={handleReaction} />
            <ThreadBar
              name={threadName}
              count={threadCount}
              image={threadImage}
              timestamp={threadTimestamp}
              onClick={() => onOpenMessage(id)}
            />
          </div>
        )}
      </div>
      {!editingId && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => onOpenMessage(id)}
          handleDelete={handleDelete}
          handleReaction={handleReaction}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};
