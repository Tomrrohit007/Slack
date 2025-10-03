import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Hint } from "../workspace/hint";
import { EmojiPopover } from "../emoji-popover";

type ToolbarProps = {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
};

export const Toolbar = ({
  isAuthor,
  isPending,
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5 shadow-none p-0 m-0">
      <div className="group-hover:opacity-100 opacity-0 top-0 p-0 m-0 transition-opacity rounded-md">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.emoji)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              onClick={handleThread}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              onClick={handleEdit}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}{" "}
      </div>
    </div>
  );
};
