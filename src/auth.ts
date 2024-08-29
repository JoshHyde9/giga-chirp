import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "argon2";

import { db } from "./lib/db";
import { signInSchema } from "./lib/schema";
import { ZodError } from "zod";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  providers: [
    Credentials({
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const creds = await signInSchema.parseAsync(credentials);

          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: creds.usernameOrEmail },
                { username: creds.usernameOrEmail },
              ],
            },
          });
          console.log(user);
          

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isValidPassword = await verify(user.password, creds.password);

          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          return { id: user.id, username: user.username } as User;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
});
