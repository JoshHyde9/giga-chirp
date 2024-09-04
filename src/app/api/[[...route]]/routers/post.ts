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
      orderBy: {createdAt: "desc"}
    });
  })
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
