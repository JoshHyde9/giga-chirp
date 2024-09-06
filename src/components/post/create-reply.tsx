"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createReplySchema } from "@/lib/schema";
import { revalidatePage } from "@/lib/revalidatePath";

import { api } from "@/server/treaty";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CreatePostProps = {
  imageUrl: string;
  username: string;
  postId: string;
  authorUsername: string;
};

export const CreateReply: React.FC<CreatePostProps> = ({
  imageUrl,
  username,
  postId,
  authorUsername
}) => {
  const [isReplying, setIsReplying] = useState(false);

  const form = useForm<z.infer<typeof createReplySchema>>({
    resolver: zodResolver(createReplySchema),
    defaultValues: {
      content: "",
      postId,
    },
  });

  const createReply = async (values: z.infer<typeof createReplySchema>) => {
    const { data, error } = await api.reply.create.post(values);

    if (error) throw error;

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createReply,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      revalidatePage();
      form.reset();
      setIsReplying(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof createReplySchema>) => {
    const parsedData = await createReplySchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <div className="flex flex-col w-full pt-4 px-2 border-b">
      <div
        className={`flex flex-row gap-x-4 mb-2 w-full text-muted-foreground ${
          isReplying ? "visible opacity-100 h-fit" : "invisible opacity-0 h-0"
        }`}
      >
        <div className="basis-10 relative"></div>
        <span>Replying to @{authorUsername}</span>
      </div>
      <div className="flex justify-center gap-x-4">
        <div className="w-10 h-10 relative">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-x-2"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem
                    className="w-full"
                    onClick={() => setIsReplying(true)}
                  >
                    <FormControl>
                      <Textarea
                        placeholder="Post your reply"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending || form.getValues("content").length === 0}
              >
                Post
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
