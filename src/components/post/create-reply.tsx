"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createReplySchema } from "@/lib/schema";

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
import { revalidatePage } from "@/lib/revalidatePath";

type CreatePostProps = {
  imageUrl: string;
  username: string;
  postId: string;
};

export const CreateReply: React.FC<CreatePostProps> = ({
  imageUrl,
  username,
  postId,
}) => {
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
    },
  });

  const onSubmit = async (values: z.infer<typeof createReplySchema>) => {
    const parsedData = await createReplySchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <div className="flex justify-center gap-x-4 pt-4 px-2 w-full border-b">
      <div className="w-10 h-10 relative">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
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
  );
};
