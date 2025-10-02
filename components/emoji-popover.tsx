import { useState } from "react";
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


type EmojiPopoverProps = {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: EmojiClickData) => void;
}

export const EmojiPopover = ({ children, hint, onEmojiSelect }: EmojiPopoverProps) => {

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const onSelect = (emojiObj: EmojiClickData) => {
    onEmojiSelect(emojiObj)
    setPopoverOpen(false)
    setTooltipOpen(false)
  }
  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              {children}
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <EmojiPicker open={popoverOpen} onEmojiClick={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}

