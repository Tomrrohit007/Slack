import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export function useMemberId() {
  const params = useParams();
  return params.memberId as Id<"members">;
}
