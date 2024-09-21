"use client";

import type { Session } from "next-auth";

import { Ellipsis, Pencil, UserPlus } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { DeletePost } from "@/components/post/delete-post";

type PostExtrasProps = {
  session: Session | null;
  authorUsername: string;
  postId: string;
};

export const PostExtras: React.FC<PostExtrasProps> = ({
  session,
  authorUsername,
  postId,
}) => {
  return (
    <Popover>
      <PopoverTrigger
        className="ml-auto duration-300 hover:bg-accent/50 px-2 rounded-md"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
        }}
      >
        <Ellipsis className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        className="cursor-pointer p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {session?.user.username !== authorUsername && (
          <Button
            className="flex items-center justify-start gap-x-1 py-2 px-4 w-full"
            variant="ghost"
          >
            <UserPlus />
            <span className="font-semibold">Follow @{authorUsername}</span>
          </Button>
        )}

        {session?.user.username === authorUsername && (
          <>
            <DeletePost postId={postId} />

            <Button
              variant="ghost"
              className="flex items-center justify-start gap-x-1 w-full py-2 px-4"
            >
              <Pencil className="size-5" />
              <span className="font-semibold">Edit post</span>
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
