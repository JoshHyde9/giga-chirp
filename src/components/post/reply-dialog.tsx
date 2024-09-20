"use client";

import type { PostWithAuthor } from "@/lib/types";
import type { Session } from "next-auth";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CreateReply } from "@/components/post/create-reply";

dayjs.extend(relativeTime);

type ReplyDialogProps = {
  post: PostWithAuthor;
  session: Session | null;
};

export const ReplyDialog: React.FC<ReplyDialogProps> = ({ post, session }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
      }}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {session ? (
          <DialogTrigger
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              e.nativeEvent.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex items-center text-sm gap-x-1 duration-300 hover:text-blue-500 hover:cursor-pointer">
              <MessageCircle className="size-4" />
              <span>{post._count.replies}</span>
            </div>
          </DialogTrigger>
        ) : (
          <div
            onClick={() => router.push("/signin")}
            className="flex items-center text-sm gap-x-1 duration-300 hover:text-blue-500 hover:cursor-pointer"
          >
            <MessageCircle className="size-4" />
            <span>{post._count.replies}</span>
          </div>
        )}

        <DialogContent
          className="max-w-md md:max-w-lg lg:max-w-xl"
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation();
          }}
        >
          <DialogHeader className="space-y-0 flex flex-row">
            <div className="w-10 h-full">
              <Avatar>
                <AvatarImage src={post.author.imageUrl} />
                <AvatarFallback>{post.author.username[0]}</AvatarFallback>
              </Avatar>
              <div className="bg-muted-foreground/50 mx-auto w-0.5 h-[calc(100%-20px)] overflow-hidden"></div>
            </div>
            <div className="flex flex-col gap-x-2 pl-2 w-full mt-0">
              <div className="flex flex-row items-center gap-x-2 pl-2">
                <DialogTitle className="text-md">
                  {post.author.name}
                </DialogTitle>
                <DialogDescription>
                  @{post.author.username} <span>·</span>{" "}
                  {dayjs(post.createdAt).fromNow()}
                </DialogDescription>
              </div>
              <div className="pl-2">
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
              </div>
            </div>
          </DialogHeader>
          {session && (
            <CreateReply
              postId={post.id}
              imageUrl={session.user.image_url}
              username={session.user.username}
              authorUsername={post.author.username}
              className="px-0 pt-0"
              setIsOpen={setIsOpen}
            />
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
