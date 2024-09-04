import { auth } from "@/auth";
import { Elysia } from "elysia";

export const useAuth = new Elysia().derive(
  { as: "global" },
  async ({ error }) => {
    const session = await auth();

    if (!session) return error("Unauthorized", "Unauthorised");

    return { session };
  }
);
