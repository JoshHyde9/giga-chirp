import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostWithAuthor } from "@/lib/types";

dayjs.extend(relativeTime);

type PostCardProps = {
    post: PostWithAuthor
  };

export const PostCard: React.FC<PostCardProps> = ({
  post: { content, createdAt, author, _count },
}) => {
  return (
    <Card className="flex w-full p-2 my-2">
      <div className="w-10 h-10 relative mt-5">
        <Image
          src={author.imageUrl}
          fill
          sizes="5vw"
          className="object-cover"
          alt="yeet"
        />
      </div>
      <div className="w-full">
        <CardHeader className="flex flex-row items-center gap-x-2 pl-2 space-y-0">
          <CardTitle className="text-xl">{author.name}</CardTitle>
          <CardDescription>
            @{author.username} <span>·</span> {dayjs(createdAt).fromNow()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-3">
          <p>{content}</p>
        </CardContent>
        <CardFooter className="flex gap-x-4 justify-around pb-2">
          <span>{_count.replies} likes</span>
          <span>{_count.likes} replies</span>
        </CardFooter>
      </div>
    </Card>
  );
};
