import { Id, Doc } from "@/convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/auth/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

type ReactionsProps = {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
};

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 my-1">
      {data.map((reaction) => (
        <button
          onClick={() => onChange(reaction.value)}
          className={cn(
            "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
            reaction.memberIds.includes(currentMemberId) &&
              "bg-blue-100/70 border-blue-500 text-white",
          )}
          key={reaction._creationTime}
        >
          {reaction.value}
          <span className="text-xs font-semibold text-muted-foreground">
            {reaction.count}
          </span>
        </button>
      ))}
    </div>
  );
};
