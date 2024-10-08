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
    imageUrl: z.string().optional(),
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
  content: z.string().min(1, "Required"),
  mediaUrl: z.string().optional()
})

export const createReplySchema = createPostSchema.extend({
  postId: z.string().cuid().min(1, "Required")
})

export const likePostSchema = z.object({
  postId: z.string().cuid().min(1, "Required")
});

export const followUserSchema = z.object({
  authorId: z.string().cuid().min(1, "Required")
});

export const editUserSchema = z.object({
  name: z.string(),
  bio: z.string(),
  imageUrl: z.string(),
  bannerUrl: z.string(),
});

export const createQuoteSchema = z.object({
  content: z.string().min(1, "Required"),
})
