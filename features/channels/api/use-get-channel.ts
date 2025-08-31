import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

type UseGetChannelProps = {
  id: Id<"channels">;
};

export function useGetChannel({ id }: UseGetChannelProps) {
  const data = useQuery(api.channels.getById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
}
