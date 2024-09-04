import type { PostWithAuthor } from "@/lib/types";

import { auth } from "@/auth";
import { api } from "@/server/treaty";

import { CreatePost } from "@/components/post/create-post";
import { PostCard } from "@/components/post/post-card";
import { SignOut } from "@/components/signout-button";

export default async function Home() {
  const session = await auth();

  const { data: posts } = await api.posts.all.get();

  return (
    <div>
      <div className="text-center">
        <h1 className="font-bold text-3xl mb-4">Giga Chirp</h1>
      </div>

      {session && <SignOut />}

      <div className="mx-auto flex flex-col justify-center w-full lg:w-1/2">
        {session && <CreatePost imageUrl={session.user.image_url} />}

        {posts &&
          posts.map((post: PostWithAuthor) => (
            <PostCard key={post.id} post={post} />
          ))}
      </div>
    </div>
  );
}
