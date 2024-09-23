
export type PostWithAuthor = {
  id: string;
  content: string;
  createdAt: string;
  mediaUrl?: string;
  likes: { userId: string }[];
  _count: {
    likes: number;
    replies: number;
  };
  author: {
    id: string;
    username: string;
    imageUrl: string;
    name: string;
    bio?: string;
    followers: {
      followingId: string;
    }[];
  };
};
