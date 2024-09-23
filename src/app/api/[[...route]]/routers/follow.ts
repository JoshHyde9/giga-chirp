import { Elysia, t } from "elysia";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const followRouter = new Elysia({ prefix: "/follow" }).use(useAuth).post(
  "/create",
  async ({ body, session, error }) => {
    if (body.authorId === session.user.id) {
      throw error("Unauthorized", "Please don't try to follow yourself");
    }

    // Check if user is already following
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: body.authorId,
        followingId: session.user.id,
      },
    });

    if (existingFollow) {
      return await db.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
    }

    return await db.follow.create({
      data: {
        followerId: body.authorId,
        followingId: session.user.id,
      },
    });
  },
  {
    body: t.Object({
      authorId: t.String(),
    }),
  }
);
