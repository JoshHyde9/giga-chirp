
"use client";

import type { PostWithAuthor } from "@/lib/types";

import { useState } from "react";
import { Repeat2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { QuoteDialog } from "@/components/post/repost/quote-dialog";
import { RepostButton } from "@/components/post/repost/repost-button";
import { cn } from "@/lib/utils";

type RepostPopoverProps = {
  isReposted: boolean;
  post: PostWithAuthor;
};

export const RepostPopover: React.FC<RepostPopoverProps> = ({
  isReposted,
  post,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn("flex items-center justify-center text-sm gap-x-1 duration-300 hover:bg-green-200/20 rounded-2xl px-2 py-1 w-11 hover:text-green-600", isReposted && "text-green-600")}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
      >
        <Repeat2
          className="size-4"
        />
        <span>
          {post._count.reposts}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="cursor-pointer p-2 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <RepostButton postId={post.id} setIsOpen={setIsOpen} />

        <QuoteDialog post={post} setIsOpen={setIsOpen} />
      </PopoverContent>
    </Popover>
  );
};
