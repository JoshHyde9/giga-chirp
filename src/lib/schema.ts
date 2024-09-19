import { z } from "zod";

export const signInSchema = z.object({
  usernameOrEmail: z.string().min(1, "Required"),
  password: z
    .string({ required_error: "Password is required " })
    .min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    username: z.string().min(1, "Required"),
    email: z.string().email(),
    name: z.string(),
    bio: z.string().optional(),
    imageUrl: z.string(),
    password: z
      .string({ required_error: "Required" })
      .min(1, "Required"),
    confirmPassword: z
      .string({ required_error: "Required" })
      .trim()
      .min(3, { message: "Password cannot be less than 3 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const createPostSchema = z.object({
  content: z.string().min(1, "Required")
})

export const createReplySchema = createPostSchema.extend({
  postId: z.string().cuid().min(1, "Required")
})

export const likePostSchema = z.object({
  postId: z.string().cuid().min(1, "Required")
})
