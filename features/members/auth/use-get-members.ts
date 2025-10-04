import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

type useGetMembersProps = {
  workspaceId: Id<"workspaces">;
};

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  const data = useQuery(api.member.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
