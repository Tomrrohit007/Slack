import { useCurrentMember } from '@/features/members/auth/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from 'lucide-react';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import SidebarItem from './sidebar-item';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import WorkspaceSection from './workspace-section';
import { useGetMembers } from '@/features/members/auth/use-get-members';
import UserItem from './user-item';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMemberId } from '@/hooks/use-member-id';
import SidebarNotItem from './sidebar-item-not';
import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';

export function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();
  const router = useRouter();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: _channelsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: members, isLoading: _membersLoading } = useGetMembers({
    workspaceId,
  });

  const [optimisticChannelId, setOptimisticChannelId] = useOptimistic(
    channelId,
    (_state, newChannelId: Id<'channels'>) => newChannelId
  );

  const [optimisticMemberId, setOptimisticMemberId] = useOptimistic(
    memberId,
    (_state, newMemberId: Id<'members'>) => newMemberId
  );

  const [isPending, startTransition] = useTransition();

  const handleChannelClick = (newChannelId: Id<'channels'>) => {
    startTransition(async () => {
      setOptimisticChannelId(newChannelId);
      setOptimisticMemberId('' as Id<'members'>);
      router.push(`/workspace/${workspaceId}/channel/${newChannelId}`);
    });
  };

  const handleMemberClick = (newMemberId: Id<'members'>) => {
    startTransition(async () => {
      setOptimisticMemberId(newMemberId);
      setOptimisticChannelId('' as Id<'channels'>);
      router.push(`/workspace/${workspaceId}/member/${newMemberId}`);
    });
  };

  if (workspaceLoading || memberLoading) {
    return (
      <div className='flex flex-col bg-[#5e2c5f] justify-center items-center h-full'>
        <Loader className='size-5 animate-spin text-white  ' />
      </div>
    );
  }

  if (!workspace || !member) {
    return null;
  }

  return (
    <div className='flex flex-col bg-[#5e2c5f] h-full'>
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />
      <div className='flex flex-col px-2 mt-3'>
        <SidebarNotItem label='Threads' icon={MessageSquareText} />
        <SidebarNotItem label='Drafts & Sent' icon={SendHorizonal} />
      </div>

      <WorkspaceSection
        label='Channels'
        hint='New channel'
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}>
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            variant={optimisticChannelId === item._id ? 'active' : 'default'}
            onClick={() => handleChannelClick(item._id)}
          />
        ))}
      </WorkspaceSection>

      {members?.map((item) => (
        <WorkspaceSection
          label='Direct messages'
          hint='New direct messages'
          onNew={() => {}}
          key={item._id}>
          <UserItem
            label={item.user.name}
            image={item.user.image}
            variant={optimisticMemberId === item._id ? 'active' : 'default'}
            onClick={() => handleMemberClick(item._id)}
          />
        </WorkspaceSection>
      ))}
    </div>
  );
}
