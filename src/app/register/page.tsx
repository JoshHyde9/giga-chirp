"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import Link from "next/link";

import { api } from "@/server/treaty";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { registerSchema } from "@/lib/schema";
import { authenticate } from "@/lib/action";

export default function Register() {
  const [globalError, setGlobalError] = useState("");

  const registerUser = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { data, error } = await api.users.register.post(values);

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  };

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onError: (err) => {
      setGlobalError(err.message);
    },
    onSuccess: async () => {
      await authenticate({
        usernameOrEmail: form.getValues("username"),
        password: form.getValues("password"),
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const parsedData = await registerSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="font-bold text-3xl mb-4">Register</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Jim" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jim@jim.com" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Yo mumma so fat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="I'll work this out later" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Must have at least 3 characters"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Must have at least 3 characters"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p
              className={`${
                globalError ? "block" : "invisible"
              } h-4 mt-2 text-red-500`}
            >
              {globalError}
            </p>

            <Button type="submit" disabled={isPending} className="mt-4 w-full">
              Register
            </Button>

            <p className="mt-3">Already have an account? <Link href="/signin">Sign in</Link></p>
          </form>
        </Form>
      </div>
    </div>
  );
}
