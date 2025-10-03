import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";

export function usePanel() {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
  };

  const onCloseMessage = () => {
    setParentMessageId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
  };
}
