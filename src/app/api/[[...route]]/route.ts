import { db } from "@/lib/db";
import { hash } from "argon2";
import { Elysia, t } from "elysia";

const app = new Elysia({ prefix: "/api" })
  .get("/hello", () => "Hello from Elysia")
  .group("/user", (app) =>
    app
      .post(
        "/register",
        async ({ body }) => {
          // Check if user already exists
          const userAlreadyExists = await db.user.findFirst({
            where: { OR: [{ username: body.username }, { email: body.email }] },
          });

          if (userAlreadyExists) {
            throw new Error("User already exists");
          }

          const hashedPassword = await hash(body.password);

          const newUser = await db.user.create({
            data: {
              email: body.email,
              imageUrl: body.imageUrl,
              password: hashedPassword,
              name: body.name,
              username: body.username,
              bio: body.bio,
            },
            select: {
              username: true,
              password: true,
            },
          });

          return {
            usernameOrEmail: newUser.username,
            password: newUser.password,
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
      .get("/allUsers", async () => {
        return await db.user.findMany();
      })
  );

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
