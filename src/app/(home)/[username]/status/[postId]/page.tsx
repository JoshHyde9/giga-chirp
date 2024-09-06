import type { PostWithAuthor } from "@/lib/types";
import { notFound } from "next/navigation";

import { api } from "@/server/treaty";

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
  const { data: post, error } = await api.posts
    .byUsernameAndId({ username: params.username })({ postId: params.postId })
    .get();

  if (error) {
    return notFound();
  }

  console.log(post);

  return (
    <main>
      <p>Hello World!</p>
    </main>
  );
}
