import { Elysia, t } from "elysia";
import { hash } from "argon2";

import { db } from "@/server/db";
import { useAuth } from "../middleware/auth";

export const userRouter = new Elysia().group("/users", (app) =>
  app
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
            id: true,
            name: true,
            username: true,
            bio: true,
            bannerUrl: true,
            imageUrl: true,
            createdAt: true,
            following: true,
            followers: true,
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
              },
            },
          },
        });

        if (!user) {
          return error("Not Found", "User does not exist.");
        }

        const posts = await db.post.findMany({
          where: {
            OR: [
              {
                author: { username: user.username },
              },
              {
                reposts: {
                  some: {
                    user: {
                      username: params.username,
                    },
                  },
                },
              },
              {
                likes: {
                  some: {
                    user: {
                      username: params.username,
                    },
                  },
                },
              },
            ],
          },
          include: {
            likes: true,
            reposts: true,
            author: true,
            _count: { select: { likes: true, replies: true, reposts: true } },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return { user, posts };
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
    .put(
      "/edit",
      async ({ body, session }) => {
        await db.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            name: body.name,
            bio: body.bio,
            imageUrl:
              body.imageUrl ||
              "https://cdn-icons-png.flaticon.com/512/10412/10412528.png",
            bannerUrl: body.bannerUrl || "https://placehold.co/606x208.png",
          },
        });

        return { success: true };
      },
      {
        body: t.Object({
          name: t.String(),
          bio: t.String(),
          imageUrl: t.String(),
          bannerUrl: t.String(),
        }),
      }
    )
    .get("/me", async ({ session }) => {
      return session;
    })
);
