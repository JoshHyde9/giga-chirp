import { Elysia, t } from "elysia";
import { hash } from "argon2";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const userRouter = new Elysia({ prefix: "/users" })
  .post(
    "/register",
    async ({ body, error }) => {
      // Check if user already exists
      const userAlreadyExists = await db.user.findFirst({
        where: { OR: [{ username: body.username }, { email: body.email }] },
      });

      if (userAlreadyExists) {
        return error("Bad Request", "User already exists");
      }

      if (body.password !== body.confirmPassword) {
        return error("Bad Request", "Passwords do not match");
      }

      const hashedPassword = await hash(body.password);

      await db.user.create({
        data: {
          email: body.email,
          imageUrl: body.imageUrl,
          password: hashedPassword,
          name: body.name,
          username: body.username,
          bio: body.bio,
        },
      });

      return {
        success: true,
      };
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String({
          format: "email",
          error: "Please enter a valid email.",
        }),
        name: t.String({ minLength: 1, error: "Name must not be empty." }),
        imageUrl: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        password: t.String(),
        confirmPassword: t.String(),
      }),
    }
  )
  .get(
    "/user/:username",
    async ({ params, error }) => {
      const user = await db.user.findUnique({
        where: {
          username: params.username,
        },
        select: {
          followers: {
            select: {
              followingId: true,
            },
          },
          posts: {
            where: {
              parentId: null,
            },
            include: {
              author: {
                select: {
                  username: true,
                  imageUrl: true,
                  name: true,
                  bio: true,
                },
              },
              _count: {
                select: { likes: true, replies: true },
              },
              likes: {
                select: {
                  userId: true,
                },
              },
            },
          },
          _count: {
            select: {
              followers: true,
              following: true,
              posts: { where: { parentId: null } },
            },
          },
          id: true,
          bio: true,
          imageUrl: true,
          name: true,
          username: true,
          createdAt: true,
        },
      });

      if (!user) {
        return error("Not Found", "User does not exist.");
      }

      return user;
    },
    {
      params: t.Object({
        username: t.String(),
      }),
    }
  )
  .get("/allUsers", async () => {
    return await db.user.findMany({
      select: {
        username: true,
      },
    });
  })
  .use(useAuth)
  .get("/me", async ({ session }) => {
    return session;
  });
