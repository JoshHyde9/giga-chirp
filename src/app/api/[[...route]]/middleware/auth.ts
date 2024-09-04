import { auth } from "@/auth";
import { Elysia } from "elysia";

export const useAuth = (app: Elysia) =>
  app.derive(async ({ error }) => {
    const session = await auth();

    if (!session) return error("Unauthorized", "Unauthorised");

    return { session };
  });
