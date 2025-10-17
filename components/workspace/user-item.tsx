import { Button } from '../ui/button';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const userItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type UserItemProps = {
  label?: string;
  image?: string;
  variant: VariantProps<typeof userItemVariants>['variant'];

  onClick: () => void;
};

const UserItem = ({
  label = 'Member',
  image,
  variant,
  onClick,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();

  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant='transparent'
      className={cn(userItemVariants({ variant }))}
      size='sm'
      onClick={onClick}>
      <Avatar className='size-6 rounded-full mr-1'>
        <AvatarImage src={image} />
        <AvatarFallback className='bg-gray-500 text-white'>
          {avatarFallback.toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className='text-sm truncate'>{label}</span>
    </Button>
  );
};

export default UserItem;
