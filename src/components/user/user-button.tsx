import type { Session } from "next-auth";

import { Ellipsis } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOut } from "./signout-button";

type UserAvatarProps = {
  session: Session;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ session }) => {
  return (
    <Popover>
      <PopoverTrigger className="py-2">
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage src={session.user.image_url} />
            <AvatarFallback>{session.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <h3 className="font-semibold">{session.user.name}</h3>
            <p className="text-sm text-muted-foreground">
              @{session.user.username}
            </p>
          </div>
          <div className="">
            <Ellipsis />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <SignOut username={session.user.username} />
      </PopoverContent>
    </Popover>
  );
};
