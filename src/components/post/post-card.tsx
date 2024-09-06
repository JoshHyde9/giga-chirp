import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Ellipsis,
  Heart,
  Link,
  Mail,
  MessageCircle,
  Share,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

dayjs.extend(relativeTime);

type PostCardProps = {
  post: PostWithAuthor;
  className: string;
};

export const PostCard: React.FC<PostCardProps> = ({
  post: { id, content, createdAt, author, _count },
  className,
}) => {
  return (
    // TODO: Make footer buttons not route to page (also turn into actual buttons)
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
            <div className="flex items-center text-sm gap-x-1 duration-300 hover:text-red-500 hover:cursor-pointer">
              <Heart className="size-4" />
              <span>{_count.likes}</span>
            </div>
            <div>
              <Popover>
                <PopoverTrigger className="py-2">
                  <Share className="size-4 duration-300 hover:text-blue-500 hover:cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="cursor-pointer">
                  {/* TODO: Copy post to clipboard */}
                  <div className="flex items-center gap-x-1">
                    <Link className="size-5" />
                    <span className="font-semibold">Copy link</span>
                  </div>

                  <div className="flex items-center gap-x-1 mt-2">
                    <Mail className="size-5" />
                    <span className="font-semibold">
                      Send via Direct Message
                    </span>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardFooter>
        </div>
      </Card>
    </NextLink>
  );
};
