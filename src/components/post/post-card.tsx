import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Ellipsis, MessageCircle } from "lucide-react";
import { default as NextLink } from "next/link";

import { PostWithAuthor } from "@/lib/types";

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

dayjs.extend(relativeTime);

type PostCardProps = {
  post: PostWithAuthor;
  className: string;
  isLiked: boolean;
};

export const PostCard: React.FC<PostCardProps> = ({
  post: { id, content, createdAt, author, _count },
  isLiked,
  className,
}) => {

  return (
    <NextLink href={`/${author.username}/status/${id}`} className={className}>
      <Card className="flex w-full py-2 px-4 shadow-none rounded-none">
        <div className="w-10 h-10 relative mt-5">
          <Avatar>
            <AvatarImage src={author.imageUrl} />
            <AvatarFallback>{author.username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full">
          <CardHeader className="flex flex-row items-center gap-x-2 pl-2 space-y-0">
            <CardTitle className="text-md">{author.name}</CardTitle>
            <CardDescription>
              @{author.username} <span>·</span> {dayjs(createdAt).fromNow()}
            </CardDescription>
            {/* TODO: turn button into popover */}
            <Button variant="ghost" className="ml-auto h-0">
              <Ellipsis className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="pl-2">
            <p>{content}</p>
          </CardContent>
          <CardFooter className="flex gap-x-4 justify-between py-1">
            <div className="flex items-center text-sm gap-x-1 duration-300 hover:text-blue-500 hover:cursor-pointer">
              <MessageCircle className="size-4" />
              <span>{_count.replies}</span>
            </div>
            <LikePost isLiked={isLiked} postId={id} likeCount={_count.likes} />
            <div>
              <SharePopover authorUsername={author.username} postId={id} />
            </div>
          </CardFooter>
        </div>
      </Card>
    </NextLink>
  );
};
