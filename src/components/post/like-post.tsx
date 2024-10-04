"use client";

import { z } from "zod";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/server/treaty";

import { likePostSchema } from "@/lib/schema";
import { revalidatePage } from "@/lib/revalidatePath";

type LikePostProps = {
  isLiked: boolean;
  postId: string;
  likeCount: number;
};

export const LikePost: React.FC<LikePostProps> = ({
  postId,
  isLiked,
  likeCount,
}) => {
  const router = useRouter();

  const likePost = async (values: z.infer<typeof likePostSchema>) => {
    const { data, error } = await api.likes.create.post(values);

    if (error) throw error;

    return data;
  };

  const { mutate } = useMutation({
    mutationFn: likePost,
    onError: (err) => {
      router.replace("/signin");
    },
    onSuccess: () => {
      revalidatePage();
    },
  });

  const onSubmit = async (values: z.infer<typeof likePostSchema>) => {
    const parsedData = await likePostSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <div
      className="flex items-center justify-center text-sm gap-x-1 duration-300 hover:bg-red-200/20 px-2 py-1 w-11 rounded-2xl hover:text-red-500 hover:cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.nativeEvent.preventDefault();
        e.stopPropagation();
        onSubmit({ postId });
      }}
    >
      <Heart
        className={`${isLiked ? "stroke-red-500 fill-red-500" : ""} size-4`}
      />
      <span className={`${isLiked ? "text-red-500" : ""}`}>{likeCount}</span>
    </div>
  );
};
