"use client";

import type { Session } from "next-auth";
import type { PostWithAuthor } from "@/lib/types";

import { Ellipsis, Pencil } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { DeletePost } from "@/components/post/delete-post";
import { FollowUserButton } from "./follow-user-button";

type PostExtrasProps = {
  session: Session | null;
  post: PostWithAuthor;
};

export const PostExtras: React.FC<PostExtrasProps> = ({ session, post }) => {
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
        {session?.user.username !== post.author.username && (
          <FollowUserButton
            variant="popover"
            authorId={post.author.id}
            authorUsername={post.author.username}
            isFollowing={
              post.author.followers &&
              !!post.author.followers.find(
                (follower) => follower.followingId === session?.user.id
              )
            }
          />
        )}

        {session?.user.username === post.author.username && (
          <>
            <DeletePost postId={post.id} />

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
