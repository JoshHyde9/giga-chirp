import type { PostWithAuthor } from "@/lib/types";

import { auth } from "@/auth";
import Image from "next/image";
import { default as NextLink } from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Ellipsis } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { SharePopover } from "@/components/post/share-popover";
import { LikePost } from "@/components/post/like-post";
import { ReplyDialog } from "@/components/post/reply-dialog";

dayjs.extend(relativeTime);

type PostCardProps = {
  post: PostWithAuthor;
  className: string;
  isLiked: boolean;
};

export const PostCard: React.FC<PostCardProps> = async ({
  post,
  isLiked,
  className,
}) => {
  const session = await auth();

  return (
    <NextLink href={`/${post.author.username}/status/${post.id}`} className={className}>
      <Card className="flex w-full py-2 px-4 shadow-none rounded-none">
        <div className="w-10 h-10 relative">
          <Avatar>
            <AvatarImage src={post.author.imageUrl} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full">
          <CardHeader className="flex flex-row items-center gap-x-2 pl-2 space-y-0">
            <CardTitle className="text-md">{post.author.name}</CardTitle>
            <CardDescription>
              @{post.author.username} <span>·</span> {dayjs(post.createdAt).fromNow()}
            </CardDescription>
            {/* TODO: turn button into popover */}
            <Button variant="ghost" className="ml-auto h-0">
              <Ellipsis className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="pl-2">
            <p>{post.content}</p>

            {post.mediaUrl && (
              <div className="flex justify-center relative h-[516px]">
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
            <LikePost isLiked={isLiked} postId={post.id} likeCount={post._count.likes} />
            <div>
              <SharePopover authorUsername={post.author.username} postId={post.id} />
            </div>
          </CardFooter>
        </div>
      </Card>
    </NextLink>
  );
};
