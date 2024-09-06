import { Elysia, t } from "elysia";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const postRouter = new Elysia({ prefix: "/posts" })
  .get("/all", async () => {
    return await db.post.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        _count: { select: { likes: true, replies: true } },
        author: { select: { username: true, imageUrl: true, name: true } },
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
            username: params.username
          }
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          _count: {
            select: { likes: true, replies: true },
          },
          replies: true,
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
        },
      });

      return post;
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  );
