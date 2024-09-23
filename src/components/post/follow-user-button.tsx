"use client";

import { UserPlus, UserRoundCheck, UserRoundPlus } from "lucide-react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/server/treaty";

import { revalidatePage } from "@/lib/revalidatePath";
import { followUserSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DefaultProps = {
  isFollowing: boolean;
  authorId: string;
};

type ConditionalProps =
  | {
      isPopover?: true;
      authorUsername?: string;
      icon?: never;
    }
  | {
      isPopover?: never;
      authorUsername?: never;
      icon?: never;
    }
  | {
      icon?: true;
      isPopover?: never;
      authorUsername?: never;
    };

type FollowUserButtonProps = DefaultProps & ConditionalProps;

export const FollowUserButton: React.FC<FollowUserButtonProps> = ({
  isPopover,
  isFollowing,
  authorId,
  authorUsername,
  icon,
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
    <>
      {icon ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmit({ authorId: authorId });
                }}
              >
                {isFollowing ? <UserRoundCheck /> : <UserRoundPlus />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFollowing ? "Unfollow" : "Follow"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button
          className={cn(
            isPopover &&
              "flex items-center justify-start gap-x-1 py-2 px-4 w-full"
          )}
          variant={isPopover ? "ghost" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            onSubmit({ authorId: authorId });
          }}
        >
          {isPopover ? (
            <>
              <UserPlus />
              <span className="font-semibold">
                {isFollowing ? "Unfollow" : "Follow"} @{authorUsername}
              </span>
            </>
          ) : isFollowing ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </>
  );
};
