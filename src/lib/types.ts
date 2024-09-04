export type PostWithAuthor = {
    id: string;
    content: string;
    createdAt: string;
    _count: {
      likes: number;
      replies: number;
    };
    author: {
      username: string;
      imageUrl: string;
      name: string;
    };
}