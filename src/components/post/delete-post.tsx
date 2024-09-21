"use client";

import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/server/treaty";

import { revalidatePage } from "@/lib/revalidatePath";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeletePost = ({ postId }: { postId: string }) => {
  const deletePostFn = async (postId: string) => {
    const { data, error } = await api.posts.delete.post({ postId });

    if (error) throw error;

    return data;
  };

  const { mutate: deletePost } = useMutation({
    mutationFn: deletePostFn,
    onSuccess: () => {
      revalidatePage();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-x-1 py-2 px-4 w-full text-red-500 hover:text-red-500"
          variant="ghost"
        >
          <Trash2 />
          <span className="font-semibold">Delete post</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete your post and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-between justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            onClick={() => deletePost(postId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
