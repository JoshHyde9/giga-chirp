import type { PostWithAuthor } from "@/lib/types";

import dayjs from "dayjs";
import { default as NextLink } from "next/link";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type PostAuthorCardProps = {
  post: PostWithAuthor;
};

export const PostAuthorCard: React.FC<PostAuthorCardProps> = ({ post }) => {
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
      <HoverCardContent className="rounded-lg">
        <div className="flex justify-between">
          <Avatar className="size-16">
            <AvatarImage src={post.author.imageUrl} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <Button>Follow</Button>
        </div>

        <div className="my-2">
          <h3 className="font-semibold">{post.author.name}</h3>
          <span className="text-muted-foreground text-sm">
            @{post.author.username}
          </span>
        </div>

        <p>{post.author.bio}</p>
      </HoverCardContent>
    </HoverCard>
  );
};
