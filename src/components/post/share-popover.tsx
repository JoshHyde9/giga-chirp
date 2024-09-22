"use client";

import { useState } from "react";
import { Share, Link, Mail, Ellipsis } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SharePopoverProps = {
  authorUsername: string;
  postId: string;
  icon: "share" | "ellipsis";
};

export const SharePopover: React.FC<SharePopoverProps> = ({
  authorUsername,
  postId,
  icon,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className={cn("py-2", icon === "ellipsis" && "ml-auto")}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
      >
        {icon === "share" ? (
          <Share className="size-4 duration-300 hover:text-blue-500 hover:cursor-pointer" />
        ) : (
          <div className="px-2 rounded-md duration-300 hover:bg-accent/50">
            <Ellipsis className="size-4" />
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="cursor-pointer p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          className="flex items-center justify-start gap-x-1 py-2 px-4 w-full"
          variant="ghost"
          onClick={() => {
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
