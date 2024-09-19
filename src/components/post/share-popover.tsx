"use client";

import { useState } from "react";
import { Share, Link, Mail } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type SharePopoverProps = {
  authorUsername: string;
  postId: string;
};

export const SharePopover: React.FC<SharePopoverProps> = ({
  authorUsername,
  postId,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className="py-2"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
      >
        <Share className="size-4 duration-300 hover:text-blue-500 hover:cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="cursor-pointer p-2">
        <Button
          className="flex items-center justify-start gap-x-1 py-2 px-4 w-full"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.nativeEvent.stopPropagation();
            navigator.clipboard.writeText(
              `${window.location.host}/${authorUsername}/status/${postId}`
            );
            setOpen(false);
          }}
        >
          <Link className="size-5" />
          <span className="font-semibold">Copy link</span>
        </Button>

        <Button
          variant="ghost"
          className="flex items-center justify-start gap-x-1 w-full py-2 px-4"
        >
          <Mail className="size-5" />
          <span className="font-semibold">Send via Direct Message</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
};
