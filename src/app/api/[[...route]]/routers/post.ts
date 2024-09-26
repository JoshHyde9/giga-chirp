import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { Elysia, t } from "elysia";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const postRouter = new Elysia().group("/posts", (app) =>
  app
    .get("/all", async () => {
      return await db.post.findMany({
        where: {
          parentId: null,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          mediaUrl: true,
          likes: {
            select: {
              userId: true,
            },
          },
          reposts: {
            select: {
              userId: true,
            },
          },
          _count: { select: { likes: true, replies: true, reposts: true } },
          author: {
            select: {
              id: true,
              username: true,
              imageUrl: true,
              name: true,
              bio: true,
              followers: {
                select: {
                  followingId: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    })
    .get(
      "/byUsernameAndId/:username/:postId",
      async ({ params, error }) => {
        const post = await db.post.findUnique({
          where: {
            id: params.postId,
            author: {
              username: params.username,
            },
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
                name: true,
                bio: true,
                followers: {
                  select: {
                    followingId: true,
                  },
                },
              },
            },
            _count: {
              select: { likes: true, replies: true, reposts: true },
            },
            likes: {
              select: {
                userId: true,
              },
            },
            reposts: {
              select: {
                userId: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    imageUrl: true,
                    bio: true,
                    followers: {
                      select: {
                        followingId: true,
                      },
                    },
                  }
                },
                likes: {
                  select: {
                    userId: true,
                  },
                },
                reposts: {
                  select: {
                    userId: true,
                  }
                },
                _count: {
                  select: { likes: true, replies: true, reposts: true },
                },
              },
            },
          },
        });

        if (!post) {
          return error("Not Found", "Post not found");
        }

        return post;
      },
      {
        params: t.Object({
          postId: t.String(),
          username: t.String(),
        }),
      }
    )
    .use(useAuth)
    .post(
      "/create",
      async ({ body, session }) => {
        const post = await db.post.create({
          data: {
            content: body.content,
            authorId: session.user.id,
            mediaUrl: body.mediaUrl,
          },
        });

        return post;
      },
      {
        body: t.Object({
          content: t.String(),
          mediaUrl: t.Optional(t.String()),
        }),
      }
    )
    .post(
      "/delete",
      async ({ body, session, error }) => {
        await db.post
          .delete({
            where: {
              id: body.postId,
              authorId: session.user.id,
            },
          })
          .catch((e: PrismaClientKnownRequestError) => {
            if (e.code === "P2025") {
              throw error("Unauthorized", "Unauthorised.");
            }
          });

        return { success: true };
      },
      {
        body: t.Object({
          postId: t.String(),
        }),
      }
    )
);
