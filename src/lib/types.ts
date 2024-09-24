
export type PostWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  mediaUrl: string | null;
  likes: { userId: string }[];
  _count: {
    likes: number;
    replies: number;
  };
  author: {
    id: string;
    username: string;
    imageUrl: string | null;
    name: string;
    bio: string | null;
    followers?: {
      followingId: string;
    }[];
  };
};
