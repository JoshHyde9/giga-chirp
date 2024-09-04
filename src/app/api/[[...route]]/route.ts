import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hash } from "argon2";
import { Elysia, t } from "elysia";
import { useAuth } from "./middleware/auth";

const app = new Elysia({ prefix: "/api" })
  .get("/hello", () => "Hello from Elysia")
  .group("/user", (app) =>
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
      })
  );

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
