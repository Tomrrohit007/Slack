import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

type UseGetMessageProps = {
  id: Id<"messages">;
};

export function useGetMessage({ id }: UseGetMessageProps) {
  const data = useQuery(api.messages.getById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
}
