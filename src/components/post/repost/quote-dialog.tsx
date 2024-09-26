"use client";

import type { PostWithAuthor } from "@/lib/types";
import type { Dispatch, SetStateAction } from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PencilLine } from "lucide-react";
import { z } from "zod";
import Image from "next/image";
import dayjs from "dayjs";

import { api } from "@/server/treaty";

import { createQuoteSchema } from "@/lib/schema";
import { revalidatePage } from "@/lib/revalidatePath";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type QuoteDialogProps = {
  post: PostWithAuthor;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const QuoteDialog: React.FC<QuoteDialogProps> = ({ post, setIsOpen }) => {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof createQuoteSchema>>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      content: "",
    },
  });

  const createQuote = async (values: z.infer<typeof createQuoteSchema>) => {
    const { data, error } = await api.repost.create.post({
      postId: post.id,
      content: values.content,
    });

    if (error) throw error;

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createQuote,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      form.reset();
      setIsOpen(false);
      setIsDialogOpen(false);
      revalidatePage();
    },
  });

  const onSubmit = async (values: z.infer<typeof createQuoteSchema>) => {
    const parsedData = await createQuoteSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-x-1 w-full py-2 px-4"
        >
          <PencilLine className="size-5" />
          <span className="font-semibold">Quote</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Quote Post</DialogTitle>
          <DialogDescription>Yeetus</DialogDescription>
        </DialogHeader>

        <div className="flex gap-x-2">
          <div className="w-10 h-full">
            <Avatar>
              <AvatarImage src={session?.user.image_url} />
              <AvatarFallback>{session?.user.username[0]}</AvatarFallback>
            </Avatar>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-x-2 w-full"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0">
                    <FormControl>
                      <Input
                        placeholder="Add a comment"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-x-2 w-full mt-0 border rounded-md">
                <div className="flex pl-2 pt-2">
                  <div className="w-10 h-full">
                    <Avatar>
                      <AvatarImage src={post.author.imageUrl} />
                      <AvatarFallback>{post.author.username[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-row items-center gap-x-2 pl-2">
                    <DialogTitle className="text-md">
                      {post.author.name}
                    </DialogTitle>
                    <DialogDescription>
                      @{post.author.username} <span>·</span>{" "}
                      {dayjs(post.createdAt).fromNow()}
                    </DialogDescription>
                  </div>
                </div>

                <div>
                  <p className="pl-2">{post.content}</p>
                  {post.mediaUrl && (
                    <div className="flex justify-center relative h-[516px] mt-2">
                      <Image
                        src={post.mediaUrl}
                        alt="media"
                        fill
                        sizes="24rem"
                        className="w-full h-full rounded-b-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending || form.getValues("content").length === 0}
                className="ml-auto mt-2"
              >
                Repost
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
