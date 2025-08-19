import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';

type useGetMemberProps = {
  workspaceId: Id<'workspaces'>;
};

export const useGetMember = ({ workspaceId }: useGetMemberProps) => {
  const data = useQuery(api.member.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
