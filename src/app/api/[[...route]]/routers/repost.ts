import { Elysia, t } from "elysia";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const repostRouter = new Elysia().group("/repost", (app) =>
  app.use(useAuth).post(
    "/create",
    async ({ body, session, error }) => {
      const existingRepost = await db.repost.findFirst({
        where: {
          postId: body.postId,
          userId: session.user.id,
        },
      });

      if (existingRepost) {
        return error("Bad Request", "You have already reposted this post");
      }

      return await db.repost.create({
        data: {
          postId: body.postId,
          userId: session.user.id,
          content: body.content || null,
        },
      });
    },
    {
      body: t.Object({
        postId: t.String(),
        content: t.Optional(t.String()),
      }),
    }
  )
);
