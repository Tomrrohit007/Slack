import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

type ThumbnailProps = {
  url: string | null | undefined;
};

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] rounded-lg border my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Message image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[1100px] border-none bg-transparent p-0 shadow-none">
        <DialogTitle />
        <img
          src={url}
          alt="full image message"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};
