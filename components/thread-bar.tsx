import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRight } from "lucide-react";

type ThreadBarProps = {
  count?: number;
  name?: string;
  image?: string;
  timestamp?: number;
  onClick?: () => void;
};

export const ThreadBar = ({
  count,
  image,
  name = "Member",
  timestamp,
  onClick,
}: ThreadBarProps) => {
  if (!count || !timestamp) return null;

  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-[600px] cursor-pointer"
    >
      <div className="flex items-center overflow-hidden gap-2">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-gray-500 text-white">
            {avatarFallback.toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 font-bold truncate hover:underline">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>

        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0 " />
    </button>
  );
};
