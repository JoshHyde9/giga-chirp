import NextAuth, { AuthError, DefaultSession, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "argon2";

import { db } from "./server/db";
import { signInSchema } from "./lib/schema";
export class InvalidLoginError extends AuthError {
  code = "invalid_credentials";
  errorMessage: string;
  constructor(message?: any, errorOptions?: any) {
    super(message, errorOptions);
    this.errorMessage = message;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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

          if (!user) throw new InvalidLoginError("invalid_credentials");

          const isValidPassword = await verify(user.password, creds.password);

          if (!isValidPassword)
            throw new InvalidLoginError("invalid_credentials");

          return {
            id: user.id,
            image_url: user.imageUrl,
            name: user.name,
            username: user.username,
          } as User;
          
        } catch (error) {
          console.log(error);

          throw new InvalidLoginError("invalid_credentials");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // @ts-ignore yeet
        token.id = user.id;
        token.image_url = user.image_url;
        token.name = user.name;
        token.username = user.username;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      // @ts-ignore yeet
      session.user.name = token.name;
      session.user.image_url = token.image_url;
      return session;
    },
  },
});

declare module "next-auth" {
  interface User {
    image_url: string;
    username: string;
  }
  interface Session {
    user: {
      id: string;
      image_url: string;
      name: string;
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    username: string;
    image_url: string;
  }
}
