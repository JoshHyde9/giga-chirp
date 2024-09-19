"use client";

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
import { Button } from "@/components/ui/button";
import { useState } from "react";

dayjs.extend(relativeTime);

type PostCardProps = {
  post: PostWithAuthor;
  className: string;
};

export const PostCard: React.FC<PostCardProps> = ({
  post: { id, content, createdAt, author, _count },
  className,
}) => {
  const [open, setOpen] = useState(false);

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
            <div className="flex items-center text-sm gap-x-1 duration-300 hover:text-red-500 hover:cursor-pointer">
              <Heart className="size-4" />
              <span>{_count.likes}</span>
            </div>
            <div>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger
                  className="py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.preventDefault();
                  }}
                >
                  <Share className="size-4 duration-300 hover:text-blue-500 hover:cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="cursor-pointer p-2">
                  <Button
                    className="flex items-center justify-start gap-x-1 py-2 px-4 w-full"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      e.nativeEvent.stopPropagation();
                      navigator.clipboard.writeText(
                        `${window.location.host}/${author.username}/status/${id}`
                      );
                      setOpen(false);
                    }}
                  >
                    <Link className="size-5" />
                    <span className="font-semibold">Copy link</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-x-1 w-full py-2 px-4"
                  >
                    <Mail className="size-5" />
                    <span className="font-semibold">
                      Send via Direct Message
                    </span>
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </CardFooter>
        </div>
      </Card>
    </NextLink>
  );
};
