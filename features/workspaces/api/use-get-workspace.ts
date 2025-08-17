import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

type useGetWorkspacesProps = {
  id: Id<"workspaces">;
};

export const useGetWorkspace = ({ id }: useGetWorkspacesProps) => {
  const data = useQuery(api.workspaces.getById, { id });

  const isLoading = data === undefined;
  return { data, isLoading };
};
