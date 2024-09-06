import type { PostWithAuthor } from "@/lib/types";
import { notFound } from "next/navigation";
import NextLink from "next/link";

import {
  ArrowLeft,
  Ellipsis,
  Heart,
  Link,
  Mail,
  MessageCircle,
  Share,
} from "lucide-react";
import dayjs from "dayjs";

import { api } from "@/server/treaty";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PostCard } from "@/components/post/post-card";
import { auth } from "@/auth";
import { CreateReply } from "@/components/post/create-reply";

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const { data: posts } = await api.posts.all.get();

  return posts.map((post: PostWithAuthor) => ({
    postId: post.id,
    username: post.author.username,
  }));
}

export default async function Page({
  params,
}: {
  params: { postId: string; username: string };
}) {
  const session = await auth();

  const { data, error } = await api.posts
    .byUsernameAndId({ username: params.username })({ postId: params.postId })
    .get();

  if (error) {
    return notFound();
  }

  const post: PostWithAuthor & { replies: PostWithAuthor[] } = data;

  return (
    <main className="w-full">
      <nav className="py-4 mb-2">
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <NextLink href="/home">
              <ArrowLeft />
            </NextLink>
          </Button>
          <h2 className="ml-2 text-2xl font-bold">Post</h2>
        </div>
      </nav>

      <article>
        <div className="flex gap-x-1 px-4">
          <Avatar>
            <AvatarImage src={post.author.imageUrl} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="font-bold">{post.author.name}</span>
            <span className="text-muted-foreground text-sm">
              @{post.author.username}
            </span>
          </div>
          {/* TODO: turn button into popover */}
          <Button variant="ghost" className="ml-auto">
            <Ellipsis />
          </Button>
        </div>

        <div className="my-4 px-4">
          <p className="mb-4">{post.content}</p>
          <time
            dateTime={post.createdAt}
            className="text-muted-foreground text-sm"
          >
            {dayjs(post.createdAt).format("h:mm A · MMM D, YYYY")}
          </time>
        </div>

        <div className="flex justify-between py-2 px-4 border-y">
          <div className="flex items-center text-sm gap-x-1 duration-300 hover:text-blue-500 hover:cursor-pointer">
            <MessageCircle className="size-4" />
            <span>{post._count.replies}</span>
          </div>
          <div className="flex items-center text-sm gap-x-1 duration-300 hover:text-red-500 hover:cursor-pointer">
            <Heart className="size-4" />
            <span>{post._count.likes}</span>
          </div>
          <Popover>
            <PopoverTrigger className="py-2">
              <Share className="size-4 duration-300 hover:text-blue-500 hover:cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="cursor-pointer">
              {/* TODO: Copy post to clipboard */}
              <div className="flex items-center gap-x-1">
                <Link className="size-5" />
                <span className="font-semibold">Copy link</span>
              </div>

              <div className="flex items-center gap-x-1 mt-2">
                <Mail className="size-5" />
                <span className="font-semibold">Send via Direct Message</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* TODO: Select menu to sort replies by likes, latest etc... */}

        {session && (
          <CreateReply
            username={session.user.username}
            imageUrl={session.user.image_url}
            postId={post.id}
            authorUsername={post.author.username}
          />
        )}

        {post.replies &&
          post.replies.map((reply) => (
            <PostCard
              key={reply.id}
              post={reply}
              className="block border-b last-of-type:border-b pt-2"
            />
          ))}
      </article>
    </main>
  );
}
