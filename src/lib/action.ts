"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { isRedirectError } from "next/dist/client/components/redirect";

export async function authenticate(formData: {
  usernameOrEmail: string;
  password: string;
}) {
  try {
    const result = await signIn("credentials", {
      usernameOrEmail: formData.usernameOrEmail,
      password: formData.password,
      redirectTo: "/",
    });
  } catch (error: any) {
    if (isRedirectError(error)) {
      return redirect("/home");
    }

    if (error.code === "invalid_credentials") {
      return { success: false, error: "Invalid credentials" };
    }

    if (error instanceof Error) {
      const { type, cause } = error as AuthError;
      switch (type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        case "CallbackRouteError":
          return { error: cause?.err?.toString() };
        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
}
