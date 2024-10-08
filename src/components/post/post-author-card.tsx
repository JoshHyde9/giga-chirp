import type { PostWithAuthor } from "@/lib/types";
import type { Session } from "next-auth";

import dayjs from "dayjs";
import { default as NextLink } from "next/link";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardTitle, CardDescription } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FollowUserButton } from "@/components/post/follow-user-button";

type PostAuthorCardProps = {
  post: PostWithAuthor;
  session: Session | null;
};

export const PostAuthorCard: React.FC<PostAuthorCardProps> = ({
  post,
  session,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        className="flex flex-row items-center gap-x-2 pl-2"
        asChild
      >
        <NextLink
          href={`/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
        >
          <CardTitle className="text-md hover:underline">
            {post.author.name}
          </CardTitle>
          <CardDescription>
            @{post.author.username} <span>·</span>{" "}
            {dayjs(post.createdAt).fromNow()}
          </CardDescription>
        </NextLink>
      </HoverCardTrigger>
      <HoverCardContent className="rounded-lg hover:cursor-default">
        <div className="flex justify-between">
          <NextLink href={`/${post.author.username}`}>
            <Avatar className="size-16">
              <AvatarImage src={post.author.imageUrl} />
              <AvatarFallback>{post.author.username[0]}</AvatarFallback>
            </Avatar>
          </NextLink>
          {session && session?.user.id !== post.author.id && (
            <FollowUserButton
              variant="button"
              authorId={post.author.id}
              isFollowing={
                post.author.followers &&
                !!post.author.followers.find(
                  (follower) => follower.followingId === session?.user.id
                )
              }
            />
          )}
        </div>

        <div className="my-2">
          <NextLink
            href={`/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold hover:underline">
              {post.author.name}
            </h3>
            <span className="text-muted-foreground text-sm">
              @{post.author.username}
            </span>
          </NextLink>
        </div>

        <p>{post.author.bio}</p>
      </HoverCardContent>
    </HoverCard>
  );
};
