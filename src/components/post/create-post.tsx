"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Image as LucideImage } from "lucide-react";

import { createPostSchema } from "@/lib/schema";

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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CreatePostProps = {
  imageUrl: string;
  username: string;
};

export const CreatePost: React.FC<CreatePostProps> = ({ imageUrl, username }) => {
  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
    },
  });

  const createPost = async (values: z.infer<typeof createPostSchema>) => {
    const { data, error } = await api.posts.create.post(values);

    if (error) throw error;

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = async (values: z.infer<typeof createPostSchema>) => {
    const parsedData = await createPostSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <div className="flex justify-center gap-x-4 py-4 px-2 w-full">
      <div className="w-10 h-10 relative">
      <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What is happening?!"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex items-center">
              {/* TODO: Implement image/media uploading via uploadthing */}
            <LucideImage />
              <Button
                type="submit"
                disabled={isPending || form.getValues("content").length === 0}
                className="mt-4 ml-auto"
              >
                Post
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
