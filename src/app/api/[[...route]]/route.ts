import { Elysia } from "elysia";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";

const app = new Elysia({ prefix: "/api" })
  .get("/hello", () => "Hello from Elysia")
  .use(userRouter)
  .use(postRouter)

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
