import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = () => {
    if (name.length < 3) return;

    mutate(
      { name },
      {
        onSuccess(id) {
          toast.success("Workspace created");
          handleClose();
          router.push(`/workspace/${id}`);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.length >= 3 && !isPending) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            disabled={isPending}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            value={name}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isPending || name.length < 3}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
