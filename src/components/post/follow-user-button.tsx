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
  isFollowing: boolean | undefined;
  authorId: string;
  variant: "popover" | "icon" | "button";
};

type ConditionalProps =
  | {
      variant: "popover";
      authorUsername: string;
    }
  | {
      authorUsername?: never;
      variant: "button";
    }
  | {
      variant: "icon";
      isPopover?: never;
      authorUsername?: never;
    };

type FollowUserButtonProps = DefaultProps & ConditionalProps;

export const FollowUserButton: React.FC<FollowUserButtonProps> = ({
  variant,
  isFollowing,
  authorId,
  authorUsername,
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
      {variant === "icon" ? (
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
            variant === "popover" &&
              "flex items-center justify-start gap-x-1 py-2 px-4 w-full"
          )}
          variant={variant === "popover" ? "ghost" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            onSubmit({ authorId: authorId });
          }}
        >
          {variant === "popover" ? (
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
