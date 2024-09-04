import { Elysia, t } from "elysia";
import { hash } from "argon2";

import { db } from "@/lib/db";
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
        imageUrl: t.String(),
        bio: t.Optional(t.String()),
        password: t.String(),
        confirmPassword: t.String(),
      }),
    }
  )
  .use(useAuth)
  .get("/me", async ({ session }) => {
    return session;
  });
