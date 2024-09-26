import { auth } from "@/auth";
import { api } from "@/server/treaty";

import { CreatePost } from "@/components/post/create-post";
import { PostCard } from "@/components/post/post-card";

export default async function Home() {
  const session = await auth();

  const { data: posts } = await api.posts.all.get();

  return (
    <div className="flex flex-col">
      {session && (
        <>
          <div className="flex justify-around sticky top-0 backdrop-blur-md z-10 border-b bg-white/50">
            <div className="w-1/2 py-4 flex justify-center items-center cursor-pointer hover:bg-accent duration-300">
              <span>For you</span>
            </div>
            <div className="flex justify-center w-1/2 py-4 items-center cursor-pointer hover:bg-accent duration-300 relative">
              <span>Following</span>
              {/* TODO: Render if "For you" or "Following" options are selected */}
              <div className="absolute bottom-0 h-1 rounded-full min-w-14 bg-black inline-flex"></div>
            </div>
          </div>

          <CreatePost
            username={session.user.name[0]}
            imageUrl={session.user.image_url}
          />
        </>
      )}

      {posts &&
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isLiked={
              !!post.likes.find((like) => like.userId === session?.user.id)
            }
            hasLoggedInUserReposted={
              !!post.reposts.find(
                (repost) => repost.userId === session?.user.id
              )
            }
            session={session}
            className="border-b last-of-type:border-b first-of-type:border-t hover:cursor-pointer"
          />
        ))}
    </div>
  );
}
