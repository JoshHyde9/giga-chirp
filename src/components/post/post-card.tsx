"use client";

import type { Session } from "next-auth";
import type { PostWithAuthor } from "@/lib/types";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { default as NextLink } from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SharePopover } from "@/components/post/share-popover";
import { LikePost } from "@/components/post/like-post";
import { ReplyDialog } from "@/components/post/reply-dialog";
import { PostExtras } from "@/components/post/post-extras-popover";
import { PostAuthorCard } from "@/components/post/post-author-card";

type PostCardProps = {
  post: PostWithAuthor;
  className: string;
  isLiked: boolean;
  session: Session | null;
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isLiked,
  session,
  className,
}) => {
  const router = useRouter();
  return (
    <section
      className={className}
      onClick={() => router.push(`/${post.author.username}/status/${post.id}`)}
    >
      <Card className="flex w-full py-2 px-4 shadow-none rounded-none">
        <NextLink
          href={`/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="size-10">
            <AvatarImage src={post.author.imageUrl!} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
        </NextLink>
        <div className="w-full">
          <CardHeader className="flex flex-row">
          <PostAuthorCard post={post} session={session} />

            {session && (
              <PostExtras
                session={session}
                post={post}
              />
            )}
          </CardHeader>
          <CardContent className="pl-2">
            <p>{post.content}</p>

            {post.mediaUrl && (
              <div className="flex justify-center relative h-[516px] mt-2">
                <Image
                  src={post.mediaUrl}
                  alt="media"
                  fill
                  sizes="24rem"
                  className="w-full h-full rounded-lg"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-x-4 justify-between py-1">
            <ReplyDialog post={post} session={session} />
            <LikePost
              isLiked={isLiked}
              postId={post.id}
              likeCount={post._count.likes}
            />
              <SharePopover
                authorUsername={post.author.username}
                postId={post.id}
                icon="share"
              />
          </CardFooter>
        </div>
      </Card>
    </section>
  );
};
