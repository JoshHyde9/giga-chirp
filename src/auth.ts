import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "argon2";

import { db } from "./lib/db";
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

          return user;
        } catch (error) {
          console.log(error);
          
          
          throw new InvalidLoginError("invalid_credentials");
        }
      },
    }),
  ],
});
