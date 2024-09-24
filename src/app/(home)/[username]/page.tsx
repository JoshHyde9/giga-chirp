import { notFound } from "next/navigation";
import NextLink from "next/link";
import dayjs from "dayjs";

import { ArrowLeft, Calendar } from "lucide-react";

import { auth } from "@/auth";
import { api } from "@/server/treaty";

import { PostCard } from "@/components/post/post-card";
import { FollowUserButton } from "@/components/post/follow-user-button";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function generateStaticParams() {
  const { data: users } = await api.users.allUsers.get();

  if (!users) {
    return notFound();
  }

  return users.map((user: { username: string }) => ({
    username: user.username,
  }));
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const session = await auth();

  const { data: user, error } = await api.users
    .user({ username: params.username })
    .get();

  if (error) {
    return notFound();
  }

  return (
    <main className="w-full">
      <nav className="pt-2 mb-2 sticky top-0 backdrop-blur-sm z-10">
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <NextLink href="/home">
              <ArrowLeft />
            </NextLink>
          </Button>
          <div className="flex flex-col ml-2">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground text-sm">
              {user._count.posts} posts
            </p>
          </div>
        </div>
      </nav>

      <section className="ml-2 px-4 pb-4">
        <div className="py-2">
          <Avatar className="size-32">
            <AvatarImage src={user.imageUrl!} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="flex w-full justify-end">
            {session && session.user.id !== user.id && (
              <FollowUserButton
                variant="icon"
                authorId={user.id}
                isFollowing={
                  user.followers &&
                  !!user.followers.find(
                    (follower) => follower.followingId === session?.user.id
                  )
                }
              />
            )}
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground mb-2">@{user.username}</p>

          {user.bio && <p className="py-2">{user.bio}</p>}

          <div className="flex items-center gap-x-1 text-muted-foreground">
            <Calendar className="size-4" /> Joined{" "}
            <span>{dayjs(user.createdAt).format("MMMM YYYY")}</span>
          </div>

          <div className="flex flex-row gap-x-4 mt-2">
            <div className="flex gap-x-1">
              <span className="font-semibold">{user._count.following}</span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex gap-x-1">
              <span className="font-semibold">{user._count.followers}</span>
              <span className="text-muted-foreground">
                {user._count.followers > 1
                  ? "Followers"
                  : user._count.followers <= 0
                  ? "Followers"
                  : "Follower"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <article>
        {user.posts &&
          user.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={
                !!post.likes.find((like) => like.userId === session?.user.id)
              }
              session={session}
              className="border-b last-of-type:border-b first-of-type:border-t hover:cursor-pointer"
            />
          ))}
      </article>
    </main>
  );
}
