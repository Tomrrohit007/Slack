import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

type UseCurrentMemberProps = {
  workspaceId: Id<"workspaces">;
};

export const useCurrentMember = ({ workspaceId }: UseCurrentMemberProps) => {
  const data = useQuery(api.member.current, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
