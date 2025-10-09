import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { AlertTriangle, Loader, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useCurrentMember } from "@/features/members/auth/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";

const TIME_THREESHOLD = 5;

type ThreadProps = {
  messageId: Id<"messages">;
  onCloseMessage: () => void;
};

type SubmitValuesProps = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const Editor = dynamic(() => import("@/components/channel/editor"));

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";

  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const Thread = ({ messageId, onCloseMessage }: ThreadProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  async function handleSubmit({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) {
    try {
      editorRef.current?.enable(false);
      setIsPending(true);

      const values: SubmitValuesProps = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-type": image.type },
          body: image,
        });

        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();
        values.image = storageId;
      }

      createMessage(values, { throwError: true });
      setEditorKey((key) => key + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  }

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = message ? new Date(message._creationTime) : Date.now();
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>,
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onCloseMessage} size="iconSm" variant="ghost">
            <XIcon className="size-5 storke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onCloseMessage} size="iconSm" variant="ghost">
            <XIcon className="size-5 storke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Thread not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onCloseMessage} size="iconSm" variant="ghost">
          <XIcon className="size-5 storke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>

            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user._id === message!.user?._id &&
                differenceInMinutes(
                  new Date(message?._creationTime!),
                  new Date(prevMessage._creationTime),
                ) < TIME_THREESHOLD;

              return (
                <Message
                  key={message?._id!}
                  id={message?._id!}
                  memberId={message?.memberId!}
                  authorImage={message?.user.image}
                  authorName={message?.user.name}
                  isAuthor={message?.memberId === currentMember?._id}
                  reactions={message?.reactions!}
                  body={message?.body!}
                  image={message?.image}
                  updatedAt={message?.updateAt!}
                  createdAt={message?._creationTime}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  isCompact={isCompact!}
                  hideThreadButton
                  threadCount={message?.threadCount}
                  threadName={message?.threadName}
                  threadImage={message?.threadImage}
                  threadTimestamp={message?.threadTimeStamp}
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 },
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          key={message?._id!}
          id={message?._id!}
          memberId={message?.memberId!}
          authorImage={message?.user.image}
          authorName={message?.user.name}
          isAuthor={message?.memberId === currentMember?._id}
          reactions={message?.reactions!}
          body={message?.body!}
          image={message?.image}
          updatedAt={message?.updateAt!}
          createdAt={message?._creationTime}
          editingId={editingId}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>
      <div className="px-4">
        <Editor
          onSubmit={handleSubmit}
          disabled={isPending}
          key={editorKey}
          innerRef={editorRef}
          placeholder="Reply.."
        />
      </div>
    </div>
  );
};
