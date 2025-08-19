import { DialogHeader, Dialog, DialogContent } from '@/components/ui/dialog';

type InviteModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const InviteModal = ({ open, setOpen }: InviteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>Invite people to your workspace</DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
