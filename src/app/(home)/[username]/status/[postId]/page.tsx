import type { PostWithAuthor } from "@/lib/types";

import { notFound } from "next/navigation";
import NextLink from "next/link";

import Image from "next/image";
import { ArrowLeft, MessageCircle } from "lucide-react";
import dayjs from "dayjs";

import { auth } from "@/auth";
import { api } from "@/server/treaty";

import { PostCard } from "@/components/post/post-card";
import { CreateReply } from "@/components/post/create-reply";
import { SharePopover } from "@/components/post/share-popover";
import { LikePost } from "@/components/post/like-post";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const { data: posts } = await api.posts.all.get();

  if (!posts) {
    return notFound();
  }

  return posts.map((post) => ({
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

  const { data: post, error } = await api.posts
    .byUsernameAndId({ username: params.username })({ postId: params.postId })
    .get();

  if (error) {
    return notFound();
  }

  return (
    <main className="w-full">
      <nav className="py-4 mb-2 sticky top-0 backdrop-blur-sm z-10">
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
            <AvatarImage src={post.author.imageUrl!} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight pl-2">
            <span className="font-bold">{post.author.name}</span>
            <span className="text-muted-foreground text-sm">
              @{post.author.username}
            </span>
          </div>
          <SharePopover
            authorUsername={post.author.username}
            postId={post.id}
            icon="ellipsis"
          />
        </div>

        <div className="my-4 px-4">
          <p className="mb-4">{post.content}</p>

          {post.mediaUrl && (
            <div className="flex justify-center relative h-[516px] my-2">
              <Image
                src={post.mediaUrl}
                alt="media"
                fill
                sizes="24rem"
                className="w-full h-full rounded-lg"
              />
            </div>
          )}

          <time
            dateTime={post.createdAt.toString()}
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
          <LikePost
            isLiked={
              !!post.likes.find((like) => like.userId === session?.user.id)
            }
            likeCount={post._count.likes}
            postId={post.id}
          />
          <SharePopover
            authorUsername={post.author.username}
            postId={post.id}
            icon="share"
          />
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
              session={session}
              isLiked={
                !!reply.likes.find((reply) => reply.userId === session?.user.id)
              }
              className="block border-b pt-2 last-of-type:border-b hover:cursor-pointer"
            />
          ))}
      </article>
    </main>
  );
}
