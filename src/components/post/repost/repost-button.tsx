import type { Dispatch, SetStateAction } from "react";

import { Repeat2 } from "lucide-react";

import { api } from "@/server/treaty";
import { revalidatePage } from "@/lib/revalidatePath";

import { Button } from "@/components/ui/button";

type RepostButtonProps = {
  postId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const RepostButton: React.FC<RepostButtonProps> = ({
  postId,
  setIsOpen,
}) => {
  const createRepost = async () => {
    const { data, error, status } = await api.repost.create.post({ postId });

    if (status === 200) {
      revalidatePage();
      setIsOpen(false);
    }
  };

  return (
    <form action={createRepost}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-x-1 w-full py-2 px-4"
      >
        <Repeat2 className="size-5" />
        <span className="font-semibold">Repost</span>
      </Button>
    </form>
  );
};
