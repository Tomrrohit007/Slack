import { api } from "@/convex/_generated/api";
import { query } from "@/convex/_generated/server";
import { useQuery } from "convex/react";

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);

  const isLoading = data === undefined;
  return { data, isLoading };
};
