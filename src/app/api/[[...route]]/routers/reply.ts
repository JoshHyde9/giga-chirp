import { Elysia, t } from "elysia";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const replyRouter = new Elysia({ prefix: "/reply" }).use(useAuth).post(
  "/create",
  async ({ body, session, error }) => {

    const reply = await db.post.create({
      data: {
        content: body.content,
        authorId: session.user.id,
        parentId: body.postId,
      },
    });

    if (!reply) {
        return error("Bad Request", "Stop trying to be sneaky");
    }

    return reply;
  },
  {
    body: t.Object({
      content: t.String(),
      postId: t.String(),
    }),
  }
);
