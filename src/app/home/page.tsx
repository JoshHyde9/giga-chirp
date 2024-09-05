import type { PostWithAuthor } from "@/lib/types";

import { auth } from "@/auth";
import { api } from "@/server/treaty";

import { CreatePost } from "@/components/post/create-post";
import { PostCard } from "@/components/post/post-card";


export default async function Home() {
  const session = await auth();

  const { data: posts } = await api.posts.all.get();

  return (
    <div className="flex flex-col w-1/2">
      {session && (
        <>
        {/* TODO: Make nav section sticky */}
          <div className="flex justify-around border-b">
            <div className="w-1/2 py-4 flex justify-center items-center cursor-pointer hover:bg-accent duration-300">
              <span>For you</span>
            </div>
            <div className="flex justify-center w-1/2 py-4 items-center cursor-pointer hover:bg-accent duration-300 relative">
              <span>Following</span>
              {/* TODO: Render if "For you" or "Following" options are selected */}
              <div className="absolute bottom-0 h-1 rounded-full min-w-14 bg-black inline-flex"></div>
            </div>
          </div>

          {/* TODO: Scroll with posts */}
          <CreatePost
            username={session.user.name[0]}
            imageUrl={session.user.image_url}
          />
        </>
      )}

      {posts &&
        posts.map((post: PostWithAuthor) => (
          <PostCard key={post.id} post={post} />
        ))}
    </div>
  );
}
