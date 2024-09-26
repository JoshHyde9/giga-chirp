export type PostWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  mediaUrl: string | null;
  likes: { userId: string }[];
  reposts: { userId: string }[];
  _count: {
    likes: number;
    replies: number;
    reposts: number;
  };
  author: {
    id: string;
    username: string;
    imageUrl: string;
    name: string;
    bio: string | null;
    followers?: {
      followingId: string;
    }[];
  };
};
