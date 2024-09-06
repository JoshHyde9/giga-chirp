import { Elysia } from "elysia";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { replyRouter } from "./routers/reply";

const app = new Elysia({ prefix: "/api" })
  .get("/hello", () => "Hello from Elysia")
  .use(userRouter)
  .use(postRouter)
  .use(replyRouter)

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
