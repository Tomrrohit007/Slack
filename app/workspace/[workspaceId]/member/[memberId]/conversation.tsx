import { Header } from "./header";
import { Id } from "@/convex/_generated/dataModel";
import { useGetMember } from "@/features/members/auth/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useMemberId } from "@/hooks/use-member-id";
import { Loader } from "lucide-react";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";

type ConversationProps = {
  id: Id<"conversations">;
};

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  const { results, status, loadMore } = useGetMessages({ conversationId: id });
  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => {}}
      />
      <MessageList
        variant="conversation"
        data={results}
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
