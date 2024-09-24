import { Elysia, t } from "elysia";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const likeRouter = new Elysia().group("/likes", (app) =>
  app.use(useAuth).post(
    "/create",
    async ({ body, session }) => {
      // Check if logged in user has already liked the post
      const like = await db.like.findFirst({
        where: {
          postId: body.postId,
          userId: session.user.id,
        },
      });

      // Delete like if logged in user has already liked the post
      if (like) {
        return await db.like.delete({
          where: {
            id: like.id,
          },
        });
      }

      // Otherwise like the post
      return await db.like.create({
        data: {
          postId: body.postId,
          userId: session.user.id,
        },
      });
    },
    {
      body: t.Object({
        postId: t.String(),
      }),
    }
  )
);
