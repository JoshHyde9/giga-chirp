"use client";

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/server/treaty";
import { revalidatePage } from "@/lib/revalidatePath";
import { followUserSchema } from "@/lib/schema";

import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostWithAuthor } from "@/lib/types";

type DefaultProps = {
  isFollowing: boolean;
  post: PostWithAuthor;
};

type ConditionalProps =
  | {
      isPopover?: true;
    }
  | {
      isPopover?: never;
    };

type FollowUserButtonProps = DefaultProps & ConditionalProps;

export const FollowUserButton: React.FC<FollowUserButtonProps> = ({
  isPopover,
  isFollowing,
  post
}) => {
  const handleFollow = async (values: z.infer<typeof followUserSchema>) => {
    const { data, error } = await api.follow.create.post(values);

    if (error) throw error;

    return data;
  };

  const { mutate } = useMutation({
    mutationFn: handleFollow,
    onSuccess: () => {
      revalidatePage();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit = async (values: z.infer<typeof followUserSchema>) => {
    const parsedData = await followUserSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <Button
      className={cn(
        isPopover && "flex items-center justify-start gap-x-1 py-2 px-4 w-full"
      )}
      variant={isPopover ? "ghost" : "default"}
      onClick={(e) => {
        e.stopPropagation();
        onSubmit({ authorId: post.author.id });
      }}
    >
      {isPopover ? (
        <>
          <UserPlus />
          <span className="font-semibold">
            {isFollowing ? "Unfollow" : "Follow"} @{post.author.username}
          </span>
        </>
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
